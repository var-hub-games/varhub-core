import {createWebConnector} from "./WebConnector";
import {databaseService} from "./dao/DatabaseService";

const port = 8088

createWebConnector().listen(port, () => {
    console.log(`Running at http://localhost:${port}/`)
});