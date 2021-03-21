import {Request, Router} from "express";
import expressWs from "express-ws";
import {UseTokenUser} from "../../middlewares/ws/wsTokenMiddleware";
import {User} from "../../dao/model/User";
import {sameOrigin} from "../../middlewares/ws/wsSameOriginMiddleware";
import {isAuth} from "../../middlewares/authMiddleware";
import {varHub} from "../../hub/VarHub";
import * as RoomMapper from "../../hub/mapper/RoomMapper";
import {roomIdRouter} from "./roomId.requests";
import {WithRoomIdParam} from "../../middlewares/roomIdMiddleware";
import {WithRoomIdWsParam} from "../../middlewares/ws/roomIdWsMiddleware";
import {Room} from "../../hub/model/Room";
import {Connection} from "../../hub/model/Connection";


export const roomRouter: expressWs.Router = Router();

roomRouter.put('', isAuth, (req: Request & {user: User}, res) => {
    let urlHandler: string;
    try {
        const urlValue = req.body.handlerUrl;
        const url = new URL(String(urlValue));
        if (!['http:','https:'].includes(url.protocol)) {
            res.statusCode = 400;
            console.log("W2", url.protocol);
            return res.json('wrong parameter: handlerUrl');
        }
        urlHandler = url.href;
    } catch (error) {
        res.statusCode = 400;
        console.log("W3", error);
        return res.json('wrong parameter: handlerUrl');
    }

    try {
        const room = varHub.createRoom(req.user.id, urlHandler);
        res.json(RoomMapper.roomToRoomInfo(room, req.user));
    } catch (error) {
        res.statusCode = 403;
        res.json('create room error');
    }
});

const wsMiddlewares = [sameOrigin, WithRoomIdWsParam('roomId'), UseTokenUser('key')]
roomRouter.ws("/:roomId/connect", ...wsMiddlewares, (ws, req: Request  & {room: Room, user: User}) => {
    const resource = String(req.query.resource ?? "");
    req.room.handleNewConnection(ws, req.user, resource);
});

roomRouter.use("/:roomId", isAuth, WithRoomIdParam("roomId"), roomIdRouter)