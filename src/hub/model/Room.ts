import {IUserInfo} from "./IUserInfo";
import {IDoor} from "./IDoor";

export class Room {
    readonly roomId: string // new room id
    readonly ownerId: string // UserInfo.id
    // owned: boolean // is it your room
    handlerUrl: string
    state: any // any json*
    users: IUserInfo[]
    door: IDoor|null

    constructor(userId: string) {
        this.ownerId = userId;
        this.roomId = generateRoomId();
    }

    getRoomInfo = (userId?: string) => {
        const {roomId, handlerUrl, state, users, door, ownerId} = this;
        const owned = (userId == ownerId)
        return {
            roomId,
            handlerUrl,
            state,
            users,
            door,
            owned
        }
    }
}

const ROOM_ID_SYMBOLS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ROOM_ID_TEMPLATE = "___-___";

const generateRoomId = () => {
    // ToDo may be duplicates ID
    return ROOM_ID_TEMPLATE.replace(/[_]/g, (c) => {
        if (c === "-") return c;
        const i = Math.floor(Math.random() * ROOM_ID_SYMBOLS.length)
        return ROOM_ID_SYMBOLS[i];
    })
}