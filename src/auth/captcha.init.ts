import expressCaptcha from 'svg-captcha-express';
import {Express} from "express";

const captchaConfig = {
    sessionId: "captcha",
    fieldName: "captcha",
    caseSensitive: false,
    url: "/api/captcha",
}

export const captcha = expressCaptcha.create({
    cookie: captchaConfig.sessionId
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