import {Room} from "./model/Room";

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
}

export const varHub = new VarHub();