import {IUserInfo} from "../model/IUserInfo";

export const userToUserInfo = (user: IUserInfo) => {
    return {
        id: user.id,
        name: user.name
    }
}