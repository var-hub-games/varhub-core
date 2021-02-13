import {createWebConnector} from "./WebConnector";

const port = 8088

createWebConnector().listen(port, () => {
    console.log(`Running at http://localhost:${port}/`)
});