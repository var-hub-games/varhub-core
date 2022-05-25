import express, { Router } from "express";
import path from "path";

export const staticRouter: Router = Router();

const indexHtmlPath = path.resolve(__dirname+'/web/index.html');
staticRouter.get('/', (req, res) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.sendFile(indexHtmlPath);
})

const roomCreateHtmlPath = path.resolve(__dirname+'/web/roomCreate.html');
staticRouter.get('/room/create', (req, res) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.sendFile(roomCreateHtmlPath);
});

const roomConnectHtmlPath = path.resolve(__dirname+'/web/connect.html');
staticRouter.get('/room/connect', (req, res) => {
    res.sendFile(roomConnectHtmlPath);
});

const roomJoinHtmlPath = path.resolve(__dirname+'/web/roomJoin.html');
staticRouter.get('/room/:id', (req, res) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.sendFile(roomJoinHtmlPath);
});

staticRouter.use('/assets', express.static(__dirname+'/web/assets'));
staticRouter.use('/css', express.static(__dirname+'/web/css'));
staticRouter.use('/style', express.static(__dirname+'/web/style'));
staticRouter.use('/webfonts', express.static(__dirname+'/web/webfonts'));
staticRouter.use('/connect.js', express.static(__dirname+'/web/connect.js'));
staticRouter.use('/index.js', express.static(__dirname+'/web/index.js'));
staticRouter.use('/roomCreate.js', express.static(__dirname+'/web/roomCreate.js'));
staticRouter.use('/roomJoin.js', express.static(__dirname+'/web/roomJoin.js'));