import {IUserInfo} from "./IUserInfo";

export interface IConnectionInfo {
    readonly id: string
    readonly account: IUserInfo
    readonly resource: string
}