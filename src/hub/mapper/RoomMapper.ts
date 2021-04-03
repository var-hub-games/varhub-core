import {Room} from "../model/Room";
import {User} from "../../dao/model/User";
import {connectionToConnectionInfo} from "./ConnectionMapper";
import {Door} from "../model/Door";
import {userToUserInfo} from "./UserMapper";

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
        door: room.ownerId === owner.id ? doorToDoorInfo(room.door) : null,
        users: [...room.connections.values()].map(con => connectionToConnectionInfo(con))
    }
}

export const doorToDoorInfo = (door: Door|null) => {
    if (!door) return null;
    return {
        mode: door.mode,
        allowlist: [...door.allowIds],
        blocklist: [...door.blockIds],
        knock: Array.from(door.knockConnections.values()).map((connectionSet) => {
            return Array.from(connectionSet.values())[0]
        }).filter(connection => {
            return connection != undefined;
        }).map(connection => {
            return userToUserInfo(connection.account);
        })
    }
}