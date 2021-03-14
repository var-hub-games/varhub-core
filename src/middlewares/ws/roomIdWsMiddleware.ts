import {Request} from "express"
import {WebsocketRequestHandler} from "express-ws";
import {varHub} from "../../hub/VarHub";

export const WithRoomIdWsParam = (param: string): WebsocketRequestHandler => (ws, req: Request, next) => {
    const {[param]: roomId} = req.params;
    try {
        const room = varHub.getRoom(roomId);
        if (!room) {
            ws.close(4404,'room not found');
            return;
        }
        req.room = room;
        next();
    } catch (error) {
        ws.close(4403, 'get room error');
    }
}