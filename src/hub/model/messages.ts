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

function VarHubEvent(type: string, data: any): string{
    return type + '\n' + JSON.stringify(data);
}