import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { User } from "../models/auth.js";
import { Session } from "../models/session.js";
import crypto from "node:crypto";
import { FIFTEEN_MINUTES, ONE_MONTH } from '../constants/index.js';
import jwt from "jsonwebtoken";
import { getEnvVar } from "../utils/getEnvVar.js";
import { sendMail } from "../utils/sendMail.js";
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMPLATES_DIR } from '../constants/index.js';
import { getFullNameFromGoogleTokenPayload, validateCode } from '../utils/googleOAuth2.js';

export async function registerUser(payload) {
    const user = await User.findOne({ email: payload.email });
    if (user) {
        throw new createHttpError.Conflict('Email in use');
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    payload.password = hashedPassword;
    return User.create(payload);
}

const createSession = () => {

    return {
        accessToken: crypto.randomBytes(32).toString('base64'),
        refreshToken: crypto.randomBytes(32).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_MONTH),
    };
};

export async function loginUser(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
        throw new createHttpError.Unauthorized('Email or password is incorrect');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new createHttpError.Unauthorized('Email or password is incorrect');
    }

    await Session.deleteOne({ userId: user._id });

    const session = createSession();

    return Session.create({
        userId: user._id,
        ...session,
    });
}

export async function logoutUser(sessionId) {
    await Session.deleteOne({ _id: sessionId });
}

export async function refreshUserSession(sessionId, refreshToken) {
    const session = await Session.findById(sessionId);

    if (session === null) {
        throw new createHttpError.Unauthorized('Session not found');
    }

    if (session.refreshToken !== refreshToken) {
        throw new createHttpError.Unauthorized('Refresh token is invalid');
    }

    if (session.refreshTokenValidUntil < new Date()) {
        throw new createHttpError.Unauthorized('Refresh token is expired');
    }

    const newSession = createSession();

    await Session.deleteOne({ _id: session._id });

    return Session.create({
        userId: session.userId,
        ...newSession,
    });
}

export async function requestPasswordReset(email) {
    const user = await User.findOne({ email });

    if (!user) {
        throw new createHttpError.NotFound("User not found");
    }

    const token = jwt.sign(
        {
            sub: user._id,
            name: user.name,
        },
        getEnvVar('JWT_SECRET'),
        {
            expiresIn: getEnvVar('JWT_EXPIRES_IN'),
        },
    );

    const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password-email.hbs',
    );

    const templateSource = (
        await fs.readFile(resetPasswordTemplatePath)
    ).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${getEnvVar('APP_DOMAIN')}/auth/reset-password?token=${token}`,
    });

    await sendMail({
        to: email,
        subject: 'Reset password',
        html,
    });
}

export async function resetPassword(token, password) {
    try {
        const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

        const user = await User.findById(decoded.sub);

        if (user === null) {
            throw new createHttpError.NotFound('User not found');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            throw new createHttpError.Unauthorized('Token is expired');
        }

        if (error.name === 'JsonWebTokenError') {
            throw new createHttpError.Unauthorized('Token is unauthorized');
        }

        throw error;
    }
}

export const loginOrSignupWithGoogle = async (code) => {
    const loginTicket = await validateCode(code);
    const payload = loginTicket.getPayload();
    if (!payload) throw createHttpError(401);

    let user = await User.findOne({ email: payload.email });
    if (!user) {
        const password = await bcrypt.hash(crypto.randomBytes(10), 10);
        user = await User.create({
            email: payload.email,
            name: getFullNameFromGoogleTokenPayload(payload),
            password,
            role: 'parent',
        });
    }

    const newSession = createSession();

    return await Session.create({
        userId: user._id,
        ...newSession,
    });
};