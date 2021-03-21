import express from "express";
import expressWs from "express-ws";

const expressApp = express();
export const app = expressWs(expressApp).app as expressWs.Application & typeof expressApp;