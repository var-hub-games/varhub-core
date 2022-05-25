import {createWebConnector} from "./WebConnector";
import "./index";

const port = process.env.VarHubPort || 8088;

const params: Parameters<typeof createWebConnector>[0] = {
    secure: process.env.VarHubSecure === "true",
    proxy: process.env.VarHubProxy === "true"
}

console.log(`Start with params`, params);
createWebConnector(params).listen(port, () => {
    console.log(`Running at https://localhost:${port}/`);
});
