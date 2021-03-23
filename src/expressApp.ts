import express from "express";
import expressWs from "express-ws";
import fs from "fs";
import https from "https";

const httpsOptions = {
    key: fs.readFileSync(require.resolve("../server.key")), // путь к ключу
    cert: fs.readFileSync(require.resolve("../server.cert")) // путь к сертификату
}

const expressApp = express();
export const server = https.createServer(httpsOptions, expressApp)
export const app = expressWs(expressApp, server).app as expressWs.Application & typeof expressApp;
app["server"] = server;
