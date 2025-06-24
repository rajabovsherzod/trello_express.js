// backend/src/config/passport.config.js

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
import userModel from '../api/users/user.model.js';

dotenv.config();

export const configurePassport = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    // Bu 'verify' callback funksiyasi har doim ishga tushadi
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Google'dan kelgan asosiy ma'lumotlar
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            const googleId = profile.id;
            
            if (!email) {
                // Agar qandaydir sabab bilan email kelmasa, xatolik qaytaramiz
                return done(new Error("Email not found from Google profile"), false);
            }

            // 1. Shu email bilan foydalanuvchi bazada bormi?
            let user = await userModel.findOne({ email: email });

            if (user) {
                // HA, MAVJUD (LOGIN HOLATI)
                // Foydalanuvchi topildi, demak u tizimga kiryapti.
                // Uni passport'ning keyingi qadamiga uzatamiz.
                return done(null, user);
            } else {
                // YO'Q, MAVJUD EMAS (RO'YXATDAN O'TISH HOLATI)
                // Bu yangi foydalanuvchi. Biz uni bazaga YARATMAYMIZ.
                // Buning o'rniga, uning ma'lumotlarini "yarim-tayyor" obyektga solib,
                // passport'ning keyingi qadamiga uzatamiz.
                const newUserShell = {
                    isNewUser: true, // Bu yangi ekanligini belgilash uchun maxsus flag
                    googleId,
                    email,
                    username: profile.displayName, // Tavsiya etilgan username
                };
                return done(null, newUserShell);
            }
        } catch (error) {
            return done(error, false);
        }
    }));


    passport.use(new GitHubStrategy({
        // .env faylidan GitHub kalitlarini olamiz
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/users/auth/github/callback',
        scope: ['user:email'], // GitHub'dan faqat foydalanuvchining emailini so'raymiz
    },
    // GitHub muvaffaqiyatli javob qaytargandan so'ng, bu funksiya ishga tushadi
    async (accessToken, refreshToken, profile, done) => {
        try {
            // GitHub'dan kelgan emailni topamiz
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

            if (!email) {
                // Agar foydalanuvchi o'z emailini public qilmagan bo'lsa, xatolik beramiz
                return done(new Error("Email not found from GitHub profile. Please make your email public."), false);
            }

            // Xuddi Google'dagi kabi, bazadan foydalanuvchi qidiramiz
            let user = await userModel.findOne({ email: email });

            if (user) {
                // Agar foydalanuvchi mavjud bo'lsa (LOGIN)
                return done(null, user);
            } else {
                // Agar foydalanuvchi mavjud bo'lmasa (REGISTER)
                const newUserShell = {
                    isNewUser: true,
                    githubId: profile.id, // googleId o'rniga githubId
                    email: email,
                    // GitHub'dan kelgan username'ni taklif qilamiz
                    username: profile.username || profile.displayName,
                };
                return done(null, newUserShell);
            }
        } catch (error) {
            return done(error, false);
        }
    }));
};