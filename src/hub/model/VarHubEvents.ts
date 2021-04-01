import {Room} from "./Room";
import {User} from "../../dao/model/User";
import {doorToDoorInfo, roomToRoomOnlineInfo} from "../mapper/RoomMapper";
import {Connection} from "./Connection";
import {IUserInfo} from "./IUserInfo";
import {userToUserInfo} from "../mapper/UserMapper";
import {connectionToConnectionInfo} from "../mapper/ConnectionMapper";
import {Door} from "./Door";

export function RoomInfoEvent(room: Room, user: User): string{
    return VarHubEvent("RoomInfoEvent", roomToRoomOnlineInfo(room, user));
}

export function ConnectionInfoEvent(connection: Connection): string{
    return VarHubEvent("ConnectionInfoEvent", connectionToConnectionInfo(connection));
}

export function UserJoinEvent(connection: Connection): string{
    return VarHubEvent("UserJoinEvent", connectionToConnectionInfo(connection));
}

export function UserLeaveEvent(connection: Connection): string{
    return VarHubEvent("UserLeaveEvent", connectionToConnectionInfo(connection));
}

export function DoorChangedEvent(door: Door): string{
    return VarHubEvent("DoorChangedEvent", doorToDoorInfo(door));
}

export function AnyMessageEvent<T extends Buffer|string>(fromConnection: string|null, message: T): T extends Buffer ? Buffer : string {
    if (message instanceof Buffer) {
        if (fromConnection) {
            const cidBuffer = Buffer.from(fromConnection, "utf8");
            const cidLength = Buffer.from(Uint32Array.of(cidBuffer.length).buffer);
            return Buffer.concat([cidLength, cidBuffer, message]) as any;
        } else {
            const cidLength = Buffer.from(Uint32Array.of(-1).buffer);
            return Buffer.concat([cidLength, message]) as any;
        }
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