import express, { Router } from "express";
import path from "path";

export const staticRouter: Router = Router();

const indexHtmlPath = path.resolve('./dist/web/index.html');
staticRouter.get('/', (req, res) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.sendFile(indexHtmlPath);
})

const roomCreateHtmlPath = path.resolve('./dist/web/roomCreate.html');
staticRouter.get('/room/create', (req, res) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.sendFile(roomCreateHtmlPath);
});

const roomConnectHtmlPath = path.resolve('./dist/web/connect.html');
staticRouter.get('/room/connect', (req, res) => {
    res.sendFile(roomConnectHtmlPath);
});

const roomJoinHtmlPath = path.resolve('./dist/web/roomJoin.html');
staticRouter.get('/room/:id', (req, res) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.sendFile(roomJoinHtmlPath);
});

staticRouter.use('/assets', express.static('./dist/web/assets'));
staticRouter.use('/css', express.static('./dist/web/css'));
staticRouter.use('/style', express.static('./dist/web/style'));
staticRouter.use('/webfonts', express.static('./dist/web/webfonts'));
staticRouter.use('/connect.js', express.static('./dist/web/connect.js'));
staticRouter.use('/index.js', express.static('./dist/web/index.js'));
staticRouter.use('/roomCreate.js', express.static('./dist/web/roomCreate.js'));
staticRouter.use('/roomJoin.js', express.static('./dist/web/roomJoin.js'));