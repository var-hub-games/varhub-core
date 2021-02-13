import express from "express"
import expressWs from "express-ws"
import bodyParser from "body-parser";
import cors from "cors";

export function createWebConnector() {


    const expressApp = express();
    const expressWsApp = expressWs(expressApp).app;
    expressApp.use(bodyParser.json());
    expressApp.use(cors());

    expressWsApp.ws("/echo", (ws, req) => {
        ws.send("HI")
        ws.onmessage = (msg) => {
            ws.send("ECHO: "+msg.data)
        }
    })

    expressApp.get('/', (req, res) => {
        res.send('Hello World!')
    })

    return expressApp;
}