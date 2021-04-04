import {Request, Router} from "express";
import expressWs from "express-ws";
import {UseTokenUser} from "../../middlewares/ws/wsTokenMiddleware";
import {User} from "../../dao/model/User";
import {wsSameOrigin} from "../../middlewares/ws/wsSameOriginMiddleware";
import {isAuth} from "../../middlewares/authMiddleware";
import {varHub} from "../../hub/VarHub";
import * as RoomMapper from "../../hub/mapper/RoomMapper";
import {roomIdRouter} from "./roomId.requests";
import {WithRoomIdParam} from "../../middlewares/roomIdMiddleware";
import {WithRoomIdWsParam} from "../../middlewares/ws/roomIdWsMiddleware";
import {Room} from "../../hub/model/Room";


export const roomRouter: expressWs.Router = Router();

roomRouter.put('/', isAuth, (req: Request & {user: User}, res) => {
    let urlHandler: string;
    try {
        const urlValue = req.body.handlerUrl;
        const url = new URL(String(urlValue));
        if (!['http:','https:'].includes(url.protocol)) {
            res.statusCode = 400;
            return res.json('wrong parameter: handlerUrl');
        }
        urlHandler = url.href;
    } catch (error) {
        res.statusCode = 400;
        return res.json('wrong parameter: handlerUrl');
    }

    try {
        const room = varHub.createRoom(req.user.id, urlHandler);
        room.setPermittedFor(req.user, true);
        res.json(RoomMapper.roomToRoomInfo(room, req.user));
        console.log(`[CreateRoom] ${req.ip} as ${req.user.name} SUCCESS: ${room.roomId} ${room.handlerUrl}`);
    } catch (error) {
        res.statusCode = 403;
        res.json('create room error');
        console.log(`[CreateRoom] ${req.ip} as ${req.user.name} FAIL`);
    }
});

roomRouter.get('/', isAuth, (req: Request & {user: User}, res) => {
    const owned = req.query.owned === "true";
    const allowed = req.query.allowed === "true";
    const result: {owned?: any, allowed?: any} = {};
    if (owned) {
        const rooms = varHub.getOwnedRoomsForUser(req.user);
        result.owned = Array.from(rooms).map(room => RoomMapper.roomToRoomInfo(room, req.user))
    }
    if (allowed) {
        const rooms = varHub.getAllowedRoomsForUser(req.user);
        result.allowed = Array.from(rooms).map(room => RoomMapper.roomToRoomInfo(room, req.user))
    }
    res.json(result);
});

const wsMiddlewares = [wsSameOrigin, WithRoomIdWsParam('roomId'), UseTokenUser('key')]
roomRouter.ws("/:roomId/connect", ...wsMiddlewares, (ws, req: Request  & {room: Room, user: User}) => {
    const resource = String(req.query.resource ?? "");
    req.room.handleNewConnection(ws, req.user, resource);
});

roomRouter.use("/:roomId", isAuth, WithRoomIdParam("roomId"), roomIdRouter)