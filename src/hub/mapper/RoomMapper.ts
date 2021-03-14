import {Room} from "../model/Room";
import {User} from "../../dao/model/User";
import {IDoor} from "../model/IDoor";
import {IConnectionInfo} from "../model/IConnectionInfo";

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
        state: room.state,
        door: doorToDoorInfo(room.door),
        users: room.connections.map(con => connectionToConnectionInfo(con))
    }
}

export const doorToDoorInfo = (door: IDoor|null) => {
    if (!door) return null;
    return {
        mode: door.mode,
        allowlist: door.allowlist,
        blocklist: door.blocklist,
    }
}

export const connectionToConnectionInfo = (connection: IConnectionInfo|null) => {
    if (!connection) return null;
    return {
        id: connection.id,
        account: {
            id: connection.account.id,
            name: connection.account.name
        }
    }
}