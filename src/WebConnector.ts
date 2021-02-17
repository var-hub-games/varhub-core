import express from "express"
import expressWs from "express-ws"
import passport from "passport";
import {initPassport} from "./auth/passport.init"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import Keygrip from "keygrip";
import expressSession from "express-session"
import {checkCaptcha, initCaptcha} from "./auth/captcha.init";
import {registerAuthRequests} from "./auth/auth.requests";

export function createWebConnector() {


    const expressApp = express();
    const expressWsApp = expressWs(expressApp).app;
    expressApp.use(cors());
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({extended: false}));
    expressApp.use(cookieParser("varhubSession"));
    expressApp.use(expressSession({
        secret : 'varhubSession',
        cookie : {
            expires: false,
        },
        resave: false,
        saveUninitialized: true
    }));
    initCaptcha(expressApp);
    initPassport(expressApp);
    registerAuthRequests(expressApp);


    expressWsApp.ws("/echo", (ws, req) => {
        ws.send("HI")
        ws.onmessage = (msg) => {
            ws.send("ECHO: "+msg.data)
        }
    })

    expressApp.get('/', (req, res) => {
        console.log(req.user);
        res.send(`
            <p>Hello, ${(req.user as any)?.name}</p>
            <img src="/api/auth/captcha"/>
            <script>
                function login(name, password, captcha) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/api/auth/login', true);
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    
                    xhr.onload = function () {
                      // Запрос завершен. Здесь можно обрабатывать результат.
                    };
                    
                    xhr.send(JSON.stringify({name, password}));
                }
                function register(name, password, captcha) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/api/auth/register', true);
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    
                    xhr.onload = function () {
                      // Запрос завершен. Здесь можно обрабатывать результат.
                    };
                    
                    xhr.send(JSON.stringify({name, password, captcha}));
                }
            </script>
        `)
        // res.send('Hello World!'+"AUTHED"+req.isAuthenticated()+" user")
    })



    expressApp.get('/success', (req, res) => {
        console.log("SUCCESS",req.user);
        res.send(`
            <p>Success, ${req.user}</p>
        `)
    })

    expressWsApp.post('/loginN', (req, res) => {
        res.type('html');
        res.end(`
            <p>CAPTCHA VALID: ${checkCaptcha(req)}</p>
        `);
    });

    return expressApp;
}