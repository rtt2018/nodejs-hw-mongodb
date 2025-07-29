// import createHttpError from 'http-errors';
import { registerUser, loginUser, logoutUser, refreshUserSession, requestPasswordReset, resetPassword } from '../services/auth.js';
import { ONE_MONTH } from '../constants/index.js';

const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_MONTH),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_MONTH),
    });
};

export async function registerUserController(req, res) {
    const user = await registerUser(req.body);

    res.json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    });
}

export async function loginUserController(req, res) {
    const session = await loginUser(req.body.email, req.body.password);

    setupSession(res, session);

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

    res.json({
        status: 204,
        message: 'Successfully logged out',
    });
}

export async function refreshUserController(req, res) {
    const { sessionId, refreshToken } = req.cookies;

    const session = await refreshUserSession(sessionId, refreshToken);

    setupSession(res, session);

    res.json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken: session.accessToken,
        },
    });
}

export async function requestPasswordResetController(req, res) {
    await requestPasswordReset(req.body.email);

    res.json({
        status: 200,
        message: 'Message sent successfully',
        data: {
            email: req.body.email,
        },
    });
};

export async function resetPasswordController(req, res) {
    const { token, password } = req.body;

    await resetPassword(token, password);

    res.json({
        status: 200,
        message: 'Password has been successfully reset.',
        data: {},
    });
};