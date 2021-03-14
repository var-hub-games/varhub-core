import express, { Router } from "express";

export const staticRouter: Router = Router();

const indexHtmlPath = require.resolve('@varhub-games/commutator/dist/index.html');
staticRouter.get('/', (req, res) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.sendFile(indexHtmlPath);
})

const roomCreateHtmlPath = require.resolve('@varhub-games/commutator/dist/roomCreate.html');
staticRouter.get('/room/create', (req, res) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.sendFile(roomCreateHtmlPath);
});

const roomConnectHtmlPath = require.resolve('@varhub-games/commutator/dist/connect.html');
staticRouter.get('/room/connect', (req, res) => {
    res.sendFile(roomConnectHtmlPath);
});

const roomJoinHtmlPath = require.resolve('@varhub-games/commutator/dist/roomJoin.html');
staticRouter.get('/room/:id/join', (req, res) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.sendFile(roomJoinHtmlPath);
});

staticRouter.use('/assets', express.static('./node_modules/@varhub-games/commutator/dist/assets'));
staticRouter.use('/css', express.static('./node_modules/@varhub-games/commutator/dist/css'));
staticRouter.use('/style', express.static('./node_modules/@varhub-games/commutator/dist/style'));
staticRouter.use('/webfonts', express.static('./node_modules/@varhub-games/commutator/dist/webfonts'));
staticRouter.use('/connect.js', express.static('./node_modules/@varhub-games/commutator/dist/connect.js'));
staticRouter.use('/index.js', express.static('./node_modules/@varhub-games/commutator/dist/index.js'));
staticRouter.use('/roomCreate.js', express.static('./node_modules/@varhub-games/commutator/dist/roomCreate.js'));
staticRouter.use('/roomJoin.js', express.static('./node_modules/@varhub-games/commutator/dist/roomJoin.js'));