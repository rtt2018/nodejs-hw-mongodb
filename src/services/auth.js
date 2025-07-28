import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { User } from "../models/auth.js";
import { Session } from "../models/session.js";
import crypto from "node:crypto";
import { FIFTEEN_MINUTES, ONE_MONTH } from '../constants/index.js';

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