import {WebsocketRequestHandler} from "express-ws";

export const wsSameOrigin: WebsocketRequestHandler = (ws, req, next) => {
    let allowOrigin = false;
    try {
        const hostOrigin = new URL(req.protocol + "://" + req.header("host")).origin
        const headerOrigin = req.header("origin");
        if (hostOrigin.toLowerCase() === String(headerOrigin).toLowerCase()) allowOrigin = true;
    } catch {}
    if (!allowOrigin) {
        ws.close(4403, "wrong origin");
        return;
    }
    return next();
}