import {Request, Router} from "express";
import passport from "passport";
import {checkCaptcha} from "./captcha.init";
import {databaseService} from "../../dao/DatabaseService";
import {User} from "../../dao/model/User";
import md5 from "md5";
import {tokenManager} from "../../middlewares/tokenManager";
import {isAuth, isNotAuth} from "../../middlewares/authMiddleware";
import {userToUserInfo} from "../../hub/mapper/UserMapper";


export const authRouter: Router = Router();

authRouter.post("/login", isNotAuth, (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            res.statusCode = 400;
            res.json("Bad username or password");
            return;
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json(userToUserInfo(user));
        });
    })(req, res, next);
});

authRouter.get("/me", isAuth, (req: Request & {user: User}, res) => {
    res.json(userToUserInfo(req.user))
})

authRouter.post("/logout", isAuth, (req, res) => {
    req.logout();
    res.statusCode = 200;
    res.json("OK");
})

const NAME_REGEX = /^([a-z]|[A-Z]|[0-9]|_|-){2,12}$/gm;
authRouter.post("/register", isNotAuth, async (req, res) => {
    const body = req.body;
    const {name, password} = body;
    if (!name || !password) {
        res.statusCode = 400;
        res.json("All fields must be provided: name, password");
        return;
    }
    if (!name.match(NAME_REGEX)) {
        res.statusCode = 400;
        res.json("Bad username");
        return;
    }
    const validCaptcha = checkCaptcha(req)
    if (!validCaptcha) {
        res.statusCode = 400;
        res.json("Invalid captcha");
        return;
    }
    const alreadyUser = await databaseService.getUserByName(name);
    if (alreadyUser) {
        res.statusCode = 400;
        res.json("Name already occupied");
        return;
    }
    try {
        const user = await databaseService.createUser(name, md5(password));
        req.login(user, (err) => {
            if (err) {
                res.statusCode = 500;
                res.json("Error occurred when log in as user");
                return;
            }
            res.statusCode = 200;
            res.json(userToUserInfo(user))
        })
    } catch (ignored) {
        res.statusCode = 500;
        console.warn(ignored);
        res.json("Error occurred when creating user");
    }
});

authRouter.get("/token", isAuth, (req, res, next) => {
    const user = req.user as User;
    const token = tokenManager.createUserToken(user);
    res.statusCode = 200;
    res.send(token);
});