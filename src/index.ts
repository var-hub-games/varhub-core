import {createWebConnector} from "./WebConnector";
import "./index";

const port = 8088

createWebConnector()["server"].listen(port, () => {
    console.log(`Running at https://localhost:${port}/`)
});