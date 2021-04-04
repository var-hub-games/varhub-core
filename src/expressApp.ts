import express from "express";
import expressWs from "express-ws";

const expressApp = express();
expressApp.set('trust proxy', 1);
export const app = expressWs(expressApp).app as expressWs.Application & typeof expressApp;
