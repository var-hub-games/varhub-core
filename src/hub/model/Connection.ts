import {IConnectionInfo} from "./IConnectionInfo";
import {User} from "../../dao/model/User";
import ws from 'ws';
import {Room} from "./Room";

export class Connection implements IConnectionInfo {

    public readonly id: string

    constructor(
        public readonly ws: ws,
        public readonly account: User,
        public readonly room: Room,
        public readonly resource: string
    ) {
        this.id = account.id+"/"+resource;
    }

    destroy(reason: string){
        if (this.ws.readyState === ws.OPEN) {
            this.ws.close(4000, reason);
        }
    }

    sendMessage(message: any){
        this.ws.send(message);
    }

}