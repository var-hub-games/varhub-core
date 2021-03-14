import { Router } from "express";
import expressWs from "express-ws";
import {UseTokenUser} from "../../middlewares/ws/wsTokenMiddleware";
import {User} from "../../dao/model/User";
import {sameOrigin} from "../../middlewares/ws/wsSameOriginMiddleware";


export const roomRouter: expressWs.Router = Router();

roomRouter.ws("/:roomId/connect", sameOrigin, UseTokenUser('key'), (ws, req) => {
    console.log("CONNECT");
    const user = req.user as User;
    const roomId = req.params.roomId;
    console.log("BEST " + user.name + " ROOM "+ roomId);
    ws.send("BEST " + user.name + " ROOM "+ roomId);
    // todo: WS ESTABLISHED
    ws.close(4099);
});