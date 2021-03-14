import {Room} from "../hub/model/Room";
import {User} from "../dao/model/User";

declare module "express" {
    interface Request {
        user?: User
        room?: Room
    }
}