import Joi from 'joi';

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        "string.base": 'Name must be a string',
        "string.min": 'Name must be at least 3 characters long',
        "string.max": 'Name must not exceed 20 characters',
        "any.required": 'Name is required'
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
        "string.base": 'Phone number must be a string',
        "string.min": 'Phone number must be at least 3 characters long',
        "string.max": 'Phone number must not exceed 20 characters',
        "any.required": 'Phone number is required'
    }),
    contactType: Joi.string().valid('work', 'home', 'personal').required().messages({
        "string.base": 'Contact type must be a string',
        "any.required": 'Contact type is required',
        "any.only": 'Contact type must be either work, home or personal'
    }),
    isFavourite: Joi.boolean().optional().messages({
        "boolean.base": 'IsFavourite must be a boolean'
    }),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).messages({
        "string.base": 'Name must be a string',
        "string.min": 'Name must be at least 3 characters long',
        "string.max": 'Name must not exceed 20 characters',
    }),
    phoneNumber: Joi.string().min(3).max(20).messages({
        "string.base": 'Phone number must be a string',
        "string.min": 'Phone number must be at least 3 characters long',
        "string.max": 'Phone number must not exceed 20 characters',
    }),
    contactType: Joi.string().valid('work', 'home', 'personal').messages({
        "string.base": 'Contact type must be a string',
        "any.only": 'Contact type must be either work, home or personal'
    }),
    isFavourite: Joi.boolean().optional().messages({
        "boolean.base": 'IsFavourite must be a boolean'
    }),
});

// .options({ abortEarly: false });

// "name": "Andriy Pavlenko",
// "phoneNumber": "+380000000003",
// "email": "dmytro3@example.com",
// "isFavourite": false,
// "contactType": "home",