import {Room} from "../Room";
import {IConnectionInfo} from "../IConnectionInfo";

export interface CommandHandler<A extends any[] = any[], R = any> {
    (connection: IConnectionInfo, room: Room, ...args: A): Promise<R>
}

export interface BinaryCommandHandler<R = any> extends CommandHandler<[Buffer], R>{}