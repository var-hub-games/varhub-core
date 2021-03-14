import {RequestHandler} from "express"
export const isAuth: RequestHandler = (req, res, next) => {
    if (req.user) next();
    else {
        res.statusCode = 401;
        res.send('"You aren\'t authorized"')
    }
}

export const isNotAuth: RequestHandler = (req, res, next) => {
    if (!req.user) next();
    else {
        res.statusCode = 400;
        res.send('"Action not permitted for authorized users"')
    }
}