import {app} from "./expressApp"; // import app before import Router!
import expressWs from "express-ws"
import express, {Express} from "express"
import passport from "passport";
import {initPassport} from "./api/auth/passport.init"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import Keygrip from "keygrip";
import expressSession from "express-session"
import {checkCaptcha, initCaptcha} from "./api/auth/captcha.init";
import {authRouter} from "./api/auth/auth.requests";
import {roomRouter} from "./api/room/room.requests";
import {staticRouter} from "./static/static.requests";

export function createWebConnector(): Express {

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser("varhubSession"));
    app.use(expressSession({
        secret : 'varhubSession',
        cookie : {
            expires: false,
        },
        resave: false,
        saveUninitialized: true
    }));
    initCaptcha(app);
    initPassport(app);
    app.use("/api/auth", authRouter);
    app.use("/api/room", roomRouter);
    app.use(staticRouter);

    return app;
}