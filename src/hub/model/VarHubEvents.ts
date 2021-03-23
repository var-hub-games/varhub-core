import {Room} from "./Room";
import {User} from "../../dao/model/User";
import {roomToRoomOnlineInfo} from "../mapper/RoomMapper";
import {Connection} from "./Connection";
import {IUserInfo} from "./IUserInfo";
import {userToUserInfo} from "../mapper/UserMapper";
import {connectionToConnectionInfo} from "../mapper/ConnectionMapper";

export function RoomInfoEvent(room: Room, user: User): string{
    return VarHubEvent("RoomInfoEvent", roomToRoomOnlineInfo(room, user));
}

export function UserJoinEvent(connection: Connection): string{
    return VarHubEvent("UserJoinEvent", connectionToConnectionInfo(connection));
}

export function UserLeaveEvent(connection: Connection): string{
    return VarHubEvent("UserLeaveEvent", connectionToConnectionInfo(connection));
}

export function UserKnockEvent(user: IUserInfo): string{
    return VarHubEvent("UserKnockEvent", userToUserInfo(user));
}

export function AnyMessageEvent<T extends Buffer|string>(fromConnection: string|null, message: T): T extends Buffer ? Buffer : string {
    if (message instanceof Buffer) {
        const cidBuffer = fromConnection ? Buffer.from(fromConnection, "utf8") : Buffer.of();
        const cidLength = Buffer.from(Uint32Array.of(cidBuffer.length).buffer);
        return Buffer.concat([cidLength, cidBuffer, message]) as any;
    } else {
        return VarHubEvent("MessageEvent", {
            from: fromConnection,
            message: message
        }) as any;
    }
}

export function RoomStateChangedEvent(path: readonly (string|number)[], value: any): string {
    return VarHubEvent("RoomStateChangedEvent", {
        path: path,
        data: value
    })
}

function VarHubEvent(type: string, data: any): string{
    return type + '\n' + JSON.stringify(data);
}