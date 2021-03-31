import {Connection} from "./Connection";
import {Room} from "./Room";
import WebSocket from "ws";
import {BinaryCommandHandler, CommandHandler} from "./commandHandlers/types";

export class ConnectionController {
    private ws: WebSocket;

    constructor(
        private connection: Connection,
        private room: Room,
        private commandHandlers: Map<string, CommandHandler>,
        private binCommandHandlers: Map<number, BinaryCommandHandler>
    ) {
        const ws = this.ws = connection.ws;
        ws.on("close", () => this.destroy);
        ws.on("message", (data) => this.handleMessage(data));
    }

    private async handleMessage(data: WebSocket.Data){
        if (typeof data === "string") return await this.handleStringMessage(data);
        if (Array.isArray(data)) return await this.handleBinMessage(Buffer.concat(data));
        return await this.handleBinMessage(data as Buffer);
    }

    private async handleStringMessage(data: string): Promise<void> {
        const [methodName, responseId, ...args] = data.split("\n");
        const handler = this.commandHandlers.get(methodName);
        if (!handler) {
            this.room.removeConnection(this.connection.id, "protocol error");
            return;
        }
        let parsedArgs;
        try {
            parsedArgs = args.map(arg => arg ? JSON.parse(arg) : undefined);
        } catch {
            this.room.removeConnection(this.connection.id, "protocol error");
            return;
        }
        try {
            const data = await handler(this.connection, this.room, ...parsedArgs);
            if (data === undefined) return;
            if (data instanceof Buffer) {
                this.sendBinaryResponse(true, Number(responseId), data);
            } else {
                this.sendTextResponse(true, responseId, JSON.stringify(data));
            }
        } catch (error) {
            if (error instanceof Buffer) {
                this.sendBinaryResponse(true, Number(responseId), error);
            } else {
                let errorMsg: string = "";
                try {
                    errorMsg = JSON.stringify(error);
                } catch {
                    try {
                        errorMsg = String(error);
                    } catch {}
                }
                this.sendTextResponse(false, responseId, errorMsg);
            }
        }
    }

    private async handleBinMessage(data: Buffer){
        const methodId = data.readInt32BE(0);
        const responseId = data.readInt32BE(4);
        const messageData = data.slice(8);
        const handler = this.binCommandHandlers.get(methodId);
        if (!handler) {
            this.room.removeConnection(this.connection.id, "protocol error");
            return;
        }
        try {
            const data = await handler(this.connection, this.room, messageData);
            if (data === undefined) return;
            if (data instanceof Buffer) {
                this.sendBinaryResponse(true, responseId, data);
            } else {
                this.sendTextResponse(true, String(responseId), JSON.stringify(data));
            }
        } catch (error) {
            if (error instanceof Buffer) {
                this.sendBinaryResponse(true, responseId, error);
            } else {
                let errorMsg: string = "";
                try {
                    errorMsg = JSON.stringify(error);
                } catch {
                    try {
                        errorMsg = String(error);
                    } catch {}
                }
                this.sendTextResponse(false, String(responseId), errorMsg);
            }
        }
    }

    private sendBinaryResponse(success: boolean, responseId: number, data: Buffer){
        const codeData = success ? successCodeData : errorCodeData;
        const responseIdData = Buffer.from(Uint32Array.of(responseId).buffer);
        const message = Buffer.concat([codeData, responseIdData, data]);
        this.ws.send(message);
    }

    private sendTextResponse(success: boolean, responseId: string, data: string){
        const codeValue = success ? "R" : "E"
        const head = codeValue + " " + responseId;
        this.ws.send(head + '\n' + data);
    }

    destroy(){}
}

const successCodeData = Buffer.from(Uint32Array.of(0x00004000).buffer);
const errorCodeData = Buffer.from(Uint32Array.of(0x00004040).buffer);