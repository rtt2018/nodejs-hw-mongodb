import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { User } from "../models/auth.js";
import { Session } from "../models/session.js";


export async function registerUser(payload) {
    const user = await User.findOne({ email: payload.email });
    if (user) {
        throw new createHttpError.Conflict('Email is already in use');
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    payload.password = hashedPassword;
    return User.create(payload);
}

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

    return Session.create({
        userId: user._id,
        accessToken: "generateAccessToken(user._id)",
        refreshToken: "generateRefreshToken(user._id)",
        accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
    );

}
