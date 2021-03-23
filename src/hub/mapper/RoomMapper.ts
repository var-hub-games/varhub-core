import {Room} from "../model/Room";
import {User} from "../../dao/model/User";
import {IDoor} from "../model/IDoor";
import {connectionToConnectionInfo} from "./ConnectionMapper";

export const roomToRoomInfo = (room: Room, owner: User) => {
    return {
        roomId: room.roomId,
        owned: room.ownerId === owner.id,
        handlerUrl: room.handlerUrl
    }
}

export const roomToRoomOnlineInfo = (room: Room, owner: User) => {
    return {
        ...roomToRoomInfo(room, owner),
        state: room.getState(),
        door: doorToDoorInfo(room.door),
        users: [...room.connections.values()].map(con => connectionToConnectionInfo(con))
    }
}

export const doorToDoorInfo = (door: IDoor|null) => {
    if (!door) return null;
    return {
        mode: door.mode,
        allowlist: [...door.allowIds],
        blocklist: [...door.blockIds],
    }
}