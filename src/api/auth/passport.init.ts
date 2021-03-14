import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import {Express} from "express";
import {databaseService} from "../../dao/DatabaseService";
import md5 from "md5";

passport.use(new LocalStrategy({
        usernameField: 'name',
        passwordField: 'password',
    },async function(name, password, done) {
        const user = await databaseService.getUserByName(name);
        console.log("TRYING GET USER",name,user);
        if (!user) {
            done(null, false, {message: "User not exists"})
            return;
        }
        if (user.password !== md5(password)) {
            done(null, false, {message: "Bad password"});
        }
        else done(null, user);
    }
))

passport.serializeUser(function(user, done) {
    done(null, (user as any).id);
});

passport.deserializeUser(async function(id, done) {
    done(null, await databaseService.getUserById(id as string));
});

export const initPassport = (expressApp: Express) => {
    expressApp.use(passport.initialize());
    expressApp.use(passport.session());
}