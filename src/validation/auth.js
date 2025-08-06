import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        "string.base": 'Name must be a string',
        "string.min": 'Name must be at least 3 characters long',
        "string.max": 'Name must not exceed 20 characters',
        "any.required": 'Name is required'
    }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).required().messages({
        'string.base': 'Email must be a string',
        'string.email': 'Wrong format email',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        "string.base": 'Password must be a string',
        "string.min": 'Password must be at least 6 characters long',
        "any.required": 'Password is required'
    }),
});

export const loginUserSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).required().messages({
        'string.base': 'Email must be a string',
        'string.email': 'Wrong format email',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        "string.base": 'Password must be a string',
        "string.min": 'Password must be at least {#limit} characters long',
        "any.required": 'Password is required'
    }),
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        "string.base": 'Token must be a string'
    }),
    password: Joi.string().min(6).required().messages({
        "string.base": 'Password must be a string',
        "string.min": 'Password must be at least {#limit} characters long',
        "any.required": 'Password is required'
    }),
});

export const requestPasswordResetSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).required().messages({
        'string.base': 'Email must be a string',
        'string.email': 'Wrong format email',
        'string.empty': 'Email is required',
    }),
});

export const loginWithGoogleOAuthSchema = Joi.object({
    code: Joi.string().required(),
});