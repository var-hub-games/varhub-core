import {IUserInfo} from "./IUserInfo";
import {IDoor} from "./IDoor";
import {VarHub} from "../VarHub";
import {IConnectionInfo} from "./IConnectionInfo";
import {User} from "../../dao/model/User";

export class Room {
    readonly roomId: string // new room id
    readonly ownerId: string // UserInfo.id
    private permit = new Set<string>();
    // owned: boolean // is it your room
    readonly handlerUrl: string
    state: any // any json*
    connections: IConnectionInfo[]
    door: IDoor|null

    constructor(private varHub: VarHub, userId: string, handlerUrl: string) {
        this.handlerUrl = handlerUrl;
        this.ownerId = userId;
        this.roomId = generateRoomId();
    }

    isPermittedFor(user: User): boolean{
        return this.permit.has(user.id);
    }

    setPermittedFor(user: User, value: boolean): boolean{
        if (value) {
            this.permit.add(user.id);
        } else {
            this.permit.delete(user.id)
        }
        return value;
    }

    destroy(): void{

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