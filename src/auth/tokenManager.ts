import {User} from "../dao/model/User";
import {Express} from "express";
import {isAuthenticatedMiddleware} from "./auth.requests";

type Token = string;

const TOKEN_MAP = Object.create(null);
const TOKEN_DESTROY_TIME = 60 * 1000;

const generateToken = (): Token => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const createUserToken = (user: User): Token => {
    const token = generateToken();
    TOKEN_MAP[token] = user;
    setTimeout(() => {
        delete TOKEN_MAP[token]
    }, TOKEN_DESTROY_TIME)
    return token;
}

const getUserByToken = (token: Token): User|undefined => {
    return TOKEN_MAP[token];
}

export const tokenManager = {
    createUserToken,
    getUserByToken
}

export const initTokenManagerRequests = (expressApp: Express) => {
    expressApp.get("/api/auth/token", isAuthenticatedMiddleware, (req, res, next) => {
        const user = req.user as User;
        if (!user) {
            res.statusCode = 500;
            res.send('"No user found');
        }
        const token = createUserToken(user);
        res.statusCode = 200;
        res.send(token);
    })
}