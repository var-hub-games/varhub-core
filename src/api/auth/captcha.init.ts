import expressCaptcha from 'svg-captcha-express';
import {Express} from "express";

const captchaConfig = {
    sessionId: "captcha",
    fieldName: "captcha",
    caseSensitive: false,
    url: "/api/auth/captcha",
}

export const captcha = expressCaptcha.create({
    cookie: captchaConfig.sessionId,
    background: "rgb(0,0,0)",
    noise: 3,
    size: 5,
    charPreset: 'abcdefghijklmnopqrstuvwxyz0123456789',
})

export const initCaptcha = (expressApp: Express) => {
    expressApp.get(captchaConfig.url, captcha.image());
}

export const checkCaptcha = (req) => {
    try {
        return captcha.check(req,req.body[captchaConfig.fieldName],captchaConfig.caseSensitive)
    } catch (ignored) {
        return false;
    }
}