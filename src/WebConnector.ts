import {app} from "./expressApp"; // import app before import Router!
import expressWs from "express-ws"
import express, {Express} from "express"
import {initPassport} from "./api/auth/passport.init"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import expressSession from "express-session"
import {initCaptcha} from "./api/auth/captcha.init";
import {authRouter} from "./api/auth/auth.requests";
import {roomRouter} from "./api/room/room.requests";
import {staticRouter} from "./static/static.requests";
import SessionFileStore from "session-file-store";

interface WebConnectorParams {
    secure?: boolean
    proxy?: boolean
}
export function createWebConnector(
    {
        secure = false,
        proxy = false,
    } : WebConnectorParams = {}
): Express {
    const FileStore = SessionFileStore(expressSession);
    const sessionConfig = {
        secret : 'varhubSession',
        proxy: false,
        httpOnly: true,
        cookie : {
            expires: false,
            sameSite: false as string|boolean|undefined,
            secure: false,
        },
        resave: true,
        saveUninitialized: true,
        store: new FileStore({
            ttl: 60*60*24*180 // 180 days
        })
    }
    if (secure) {
        sessionConfig.cookie.sameSite = "none";
        sessionConfig.cookie.secure = true;
    }
    if (proxy) {
        sessionConfig.proxy = true;
        app.set('trust proxy', 1) // trust first proxy
    }

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser("varhubSession"));
    app.use(expressSession(sessionConfig));
    initCaptcha(app);
    initPassport(app);
    app.use("/api/auth", authRouter);
    app.use("/api/room", roomRouter);
    app.use(staticRouter);

    return app;
}