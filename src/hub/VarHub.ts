import {Room} from "./model/Room";
import {User} from "../dao/model/User";
import {BinaryCommandHandler, CommandHandler} from "./model/commandHandlers/types";

export class VarHub {

    private roomMap = new Map<string, Room>();

    getRoom(id: string): Room|null {
        return this.roomMap.get(id) ?? null;
    }

    createRoom(ownerId: string, handlerUrl: string): Room {
        const room = new Room(this, ownerId, handlerUrl);
        this.roomMap.set(room.roomId, room);
        return room;
    }

    deleteRoom(room: Room): boolean {
        room.destroy();
        this.roomMap.delete(room.roomId);
        return true;
    }

    getAllowedRoomsForUser(user: User): Set<Room>{
        const rooms = new Set<Room>();
        for (const room of this.roomMap.values()) {
            if (room.isPermittedFor(user)) rooms.add(room);
        }
        return rooms;
    }

    getOwnedRoomsForUser(user: User): Set<Room>{
        const rooms = new Set<Room>();
        for (const room of this.roomMap.values()) {
            if (room.ownerId === user.id) rooms.add(room);
        }
        return rooms;
    }
}

export const varHub = new VarHub();