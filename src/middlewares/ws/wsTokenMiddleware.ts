import {tokenManager} from "../tokenManager";
import {WebsocketRequestHandler} from "express-ws";

export const UseTokenUser = (tokenName: string): WebsocketRequestHandler => (ws, req, next) => {
    const {[tokenName]: token} = req.query;
    const user = token ? tokenManager.getUserByToken(String(token)): undefined;
    if (user) {
        req.user = user;
        next();
    } else {
        ws.close(4401,"You aren\'t authorized");
    }
}