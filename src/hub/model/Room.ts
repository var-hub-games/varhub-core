import {VarHub} from "../VarHub";
import {User} from "../../dao/model/User";
import ws from 'ws';
import {Connection} from "./Connection";
import {
    AnyMessageEvent,
    RoomInfoEvent,
    RoomStateChangedEvent,
    UserJoinEvent,
    UserLeaveEvent,
    ConnectionInfoEvent
} from "./VarHubEvents";
import {Door} from "./Door";
import {Replacement, StateHandler} from "./StateHandler";
import {ConnectionController} from "./ConnectionController";
import {textCommandHandlers} from "./commandHandlers/textCommandHandlers";
import {binCommandHandlers} from "./commandHandlers/binCommandHandlers";

export class Room {
    readonly roomId: string // new room id
    readonly ownerId: string // UserInfo.id
    private permit = new Set<string>();
    readonly handlerUrl: string
    readonly connections = new Map<string, Connection>();
    readonly door: Door;
    private readonly stateHandler = new StateHandler(null);

    constructor(private varHub: VarHub, userId: string, handlerUrl: string) {
        this.handlerUrl = handlerUrl;
        this.ownerId = userId;
        this.roomId = generateRoomId();
        this.door = new Door(this);
    }

    isPermittedFor(user: User): boolean{
        return this.permit.has(user.id);
    }

    getState(): any {
        return this.stateHandler.getState();
    }

    replaceState(replacements: Replacement[]) {
        this.stateHandler.applyReplacements(replacements);
        for (const replacement of replacements) {
            this.broadcastEvent(RoomStateChangedEvent(replacement.path, replacement.data));
        }
    }

    setPermittedFor(user: User, value: boolean): boolean{
        if (value) {
            this.permit.add(user.id);
        } else {
            this.permit.delete(user.id)
        }
        return value;
    }

    handleNewConnection(ws: ws, user: User, resource: string){
        const connection = new Connection(ws, user, this, resource);
        connection.sendMessage(ConnectionInfoEvent(connection))
        this.door.enterConnection(connection);
    }

    connect(connection: Connection){
        this.removeConnection(connection.id, "reconnected");
        this.broadcastEvent(UserJoinEvent(connection));
        this.connections.set(connection.id, connection);
        connection.sendMessage(RoomInfoEvent(this, connection.account));
        const controller = new ConnectionController(connection, this, textCommandHandlers, binCommandHandlers);
        connection.ws.addEventListener("close", () => {
            this.onDisconnect(connection);
            controller.destroy();
        });
    }

    private onDisconnect(connection: Connection){
        this.removeConnection(connection.id, "disconnected");
    }

    removeConnection(connectionId: string, reason: string): boolean{
        const connection = this.connections.get(connectionId);
        if (!connection) return false;
        this.connections.delete(connectionId);
        this.broadcastEvent(UserLeaveEvent(connection));
        connection.destroy(reason);
        return true;
    }

    broadcastEvent(message: any, exceptConnectionId?: string[]){
        for (const [, connection] of this.connections) {
            if (exceptConnectionId && exceptConnectionId.includes(connection.id)) continue
            connection.sendMessage(message);
        }
    }

    broadcastOwnerEvent(message: any, exceptConnectionId?: string[]){
        for (const [, connection] of this.connections) {
            if (connection.account.id !== this.ownerId) continue;
            if (exceptConnectionId && exceptConnectionId.includes(connection.id)) continue
            connection.sendMessage(message);
        }
    }

    sendMessage(
        fromConnectionId: string, toConnectionIds: string[]|null, service: boolean, message: any
    ): {[connectionId: string]: boolean} {
        const result: {[connectionId: string]: boolean} = {};
        if (toConnectionIds === null) toConnectionIds = [...this.connections.keys()];
        const from = service ? null : fromConnectionId;
        for (let toConnectionId of toConnectionIds) {
            if (toConnectionId === fromConnectionId) continue;
            const connection = this.connections.get(toConnectionId);
            if (!connection) continue;
            connection.sendMessage(AnyMessageEvent(from, message));
        }
        return result;
    }

    destroy(): void{
        for (const [, connection] of this.connections) {
            connection.destroy("room destroyed");
        }
    }
}

const ROOM_ID_SYMBOLS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ROOM_ID_TEMPLATE = "___-___";

const generateRoomId = () => {
    // ToDo may be duplicates ID
    return ROOM_ID_TEMPLATE.replace(/[_]/g, (c) => {
        if (c === "-") return c;
        const i = Math.floor(Math.random() * ROOM_ID_SYMBOLS.length)
        return ROOM_ID_SYMBOLS[i];
    })
}