import {VarHub} from "../VarHub";
import {User} from "../../dao/model/User";
import ws from 'ws';
import {Connection} from "./Connection";
import {UserJoinEvent, UserKnockEvent, UserLeaveEvent} from "./messages";
import {Door} from "./Door";

export class Room {
    readonly roomId: string // new room id
    readonly ownerId: string // UserInfo.id
    private permit = new Set<string>();
    readonly handlerUrl: string
    state: any // any json*
    readonly connections = new Map<string, Connection>();
    readonly door: Door;

    constructor(private varHub: VarHub, userId: string, handlerUrl: string) {
        this.handlerUrl = handlerUrl;
        this.ownerId = userId;
        this.roomId = generateRoomId();
        this.door = new Door(this);
    }

    isPermittedFor(user: User): boolean{
        return this.permit.has(user.id);
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
        this.door.enterConnection(connection);
    }

    connect(connection: Connection){
        this.removeConnection(connection.id, "reconnected");
        this.connections.set(connection.id, connection);
        this.broadcast(UserJoinEvent(connection));
        // todo: send room data to connection
        connection.ws.addEventListener("close", () => this.onDisconnect(connection));
    }

    private onDisconnect(connection: Connection){
        this.removeConnection(connection.id, "disconnected");
    }

    knock(connection: Connection){
        this.broadcast(UserKnockEvent(connection.account));
    }

    removeConnection(connectionId: string, reason: string): boolean{
        const connection = this.connections.get(connectionId);
        if (!connection) return false;
        this.connections.delete(connectionId);
        this.broadcast(UserLeaveEvent(connection));
        connection.destroy(reason);
        return true;
    }

    private broadcast(message: any){
        for (const [, connection] of this.connections) {
            connection.sendMessage(message);
        }
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