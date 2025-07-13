import { isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
    if (isHttpError(err)) {
        res.status(err.status).json({
            status: err.status,
            message: err.name,
            data: err,
        });
        return;
    }

    res.status(500).json({
        status: 500,
        message: 'Something went wrong',
        data: err.message,
    });
};

export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Route not found',
    });
};