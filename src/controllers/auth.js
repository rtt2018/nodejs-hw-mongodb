// import createHttpError from 'http-errors';
import { registerUser, loginUser, logoutUser, refreshUserSession } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';

export async function registerUserController(req, res) {
    const user = await registerUser(req.body);

    res.json({
        status: 201,
        message: 'User registered successfully',
        data: user,
    });
}

export async function loginUserController(req, res) {
    const session = await loginUser(req.body.email, req.body.password);

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });

    res.cookie('sessionId', session.id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });

    res.json({
        status: 200,
        message: 'User logged in successfully',
        data: {
            accessToken: session.accessToken,
        },
    });
}

export async function logoutUserController(req, res) {
    const { sessionId } = req.cookies;

    if (typeof sessionId !== 'undefined') {
        await logoutUser(sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
}

const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });
};

export async function refreshUserController(req, res) {
    const { sessionId, refreshToken } = req.cookies;

    const session = await refreshUserSession(sessionId, refreshToken);

    setupSession(res, session);

    res.json({
        status: 200,
        message: 'Session refreshed successfully',
        data: {
            accessToken: session.accessToken,
        },
    });
}