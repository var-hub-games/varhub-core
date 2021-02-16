import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import {Express} from "express";

const USER_MAP = {
    "1": {username: "MYXOMOPX", id: "1"}
}

passport.use(new LocalStrategy(  function(username, password, done) {
    console.log("STRATEGY LOCAL EX")
    if (username !== USER_MAP[1].username) done(null, false, { message: 'Incorrect username.' });
    else done(null, USER_MAP[1])
}))

passport.serializeUser(function(user, done) {
    console.log("SER",(user as any).id)
    done(null, (user as any).id);
});

passport.deserializeUser(function(user, done) {
    console.log("DESER",user)
    done(null, USER_MAP[user as string]);
});

export const initPassport = (expressApp: Express) => {
    expressApp.use(passport.initialize());
    expressApp.use(passport.session());
    expressApp.post('/login',
        passport.authenticate('local', { successRedirect: '/success',
            failureRedirect: '/failed' }));

}