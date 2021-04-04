import {IDoor, DOOR_MODE} from "./IDoor";
import {IConnectionInfo} from "./IConnectionInfo";
import {Room} from "./Room";
import {Connection} from "./Connection";
import {DoorChangedEvent} from "./VarHubEvents";

export class Door implements IDoor {

    mode: DOOR_MODE = "knock";
    readonly allowIds = new Set<string>();
    readonly blockIds = new Set<string>();
    readonly knockConnections = new Map<string, Set<Connection>>();

    constructor(
        public readonly room: Room,
    ) {}

    setMode(mode: DOOR_MODE){
        if (this.mode === mode) return;
        this.mode = mode;
        this.room.broadcastOwnerEvent(DoorChangedEvent(this));
    }

    enterConnection(connection: Connection): void{
        const userId = connection.account.id;
        if (userId === this.room.ownerId) return this.room.connect(connection);

        if (this.allowIds.has(userId)) return this.room.connect(connection);

        if (this.blockIds.has(userId)) return connection.destroy("blocked");

        if (this.mode === "open") return this.room.connect(connection);
        if (this.mode === "closed") return connection.destroy("blocked");
        if (this.mode === "knock") return this.knockAndWait(connection);

        // unknown door mode:
        return connection.destroy("blocked");
    }

    private addKnockConnection(connection: Connection): void{
        const userId = connection.account.id;
        connection.ws.on("close", () => this.deleteKnockConnection(connection));
        let connections = this.knockConnections.get(userId);
        if (!connections) {
            connections = new Set<Connection>();
            this.knockConnections.set(userId, connections);
        }
        connections.add(connection);
    }

    private deleteKnockConnection(connection: Connection): void{
        const userId = connection.account.id;
        const connections = this.knockConnections.get(userId);
        if (!connections) return;
        connections.delete(connection);
        if (connections.size === 0) {
            this.knockConnections.delete(userId);
        }
        this.room.broadcastOwnerEvent(DoorChangedEvent(this));
    }

    private knockAndWait(connection: Connection){
        this.addKnockConnection(connection);
        this.room.broadcastOwnerEvent(DoorChangedEvent(this));
    }

    allowUserId(userId: string){
        this.blockIds.delete(userId);
        this.allowIds.add(userId);
        const connections = this.knockConnections.get(userId);
        if (connections && connections.size > 0) {
            this.knockConnections.delete(userId);
            for (let connection of connections) {
                this.room.connect(connection);
            }
        }
        this.room.broadcastOwnerEvent(DoorChangedEvent(this));
    }

    blockUserId(userId: string){
        this.allowIds.delete(userId);
        this.blockIds.add(userId);
        const connections = this.knockConnections.get(userId);
        if (connections && connections.size > 0) {
            this.knockConnections.delete(userId);
            for (let connection of connections) {
                connection.destroy("blocked");
            }
        }
        for (let connection of this.room.connections.values()) {
            if (connection.account.id === userId) {
                this.room.removeConnection(connection, "blocked");
            }
        }
        this.room.broadcastOwnerEvent(DoorChangedEvent(this));
    }

}