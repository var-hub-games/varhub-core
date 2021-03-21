import {IConnectionInfo} from "../model/IConnectionInfo";
import {userToUserInfo} from "./UserMapper";

export const connectionToConnectionInfo = (connection: IConnectionInfo|null) => {
    if (!connection) return null;
    return {
        id: connection.id,
        account: userToUserInfo(connection.account),
        resource: connection.resource
    }
}