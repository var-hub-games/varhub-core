import {RequestHandler, Request} from "express"
import {varHub} from "../hub/VarHub";

export const WithRoomIdParam = (param: string): RequestHandler => (req: Request, res, next) => {
    const {[param]: roomId} = req.params;
    try {
        const room = varHub.getRoom(roomId);
        if (!room) {
            res.statusCode = 404;
            res.json('room not found');
            return;
        }
        req.room = room;
        next();
    } catch (error) {
        res.statusCode = 403;
        res.json('get room error');
    }
}