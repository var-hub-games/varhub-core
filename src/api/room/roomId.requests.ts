import {Request, Router} from "express";
import expressWs from "express-ws";
import {UseTokenUser} from "../../middlewares/ws/wsTokenMiddleware";
import {User} from "../../dao/model/User";
import {sameOrigin} from "../../middlewares/ws/wsSameOriginMiddleware";
import {isAuth} from "../../middlewares/authMiddleware";
import {varHub} from "../../hub/VarHub";
import * as RoomMapper from "../../hub/mapper/RoomMapper";
import {Room} from "../../hub/model/Room";
import {roomRouter} from "./room.requests";


export const roomIdRouter: expressWs.Router = Router();

roomIdRouter.get('', (req: Request & {room: Room, user: User}, res) => {
    res.json(RoomMapper.roomToRoomInfo(req.room, req.user));
});

roomIdRouter.delete('', (req: Request & {room: Room, user: User}, res) => {
    if (req.room.ownerId !== req.user.id) {
        res.statusCode = 403;
        res.json('permitted for room owner only');
    }
    try {
        res.json(varHub.deleteRoom(req.room));
    } catch (error) {
        res.statusCode = 400;
        res.json('can not delete room');
    }
});

roomIdRouter.get('/permit', (req: Request & {room: Room, user: User}, res) => {
    res.json(req.room.isPermittedFor(req.user));
});

roomIdRouter.put('/permit', (req: Request & {room: Room, user: User}, res) => {
    res.json(req.room.setPermittedFor(req.user, true));
});

roomIdRouter.delete('/permit', (req: Request & {room: Room, user: User}, res) => {
    res.json(req.room.setPermittedFor(req.user, false));
});
