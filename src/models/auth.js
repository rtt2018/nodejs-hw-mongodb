import { Schema, model } from 'mongoose';

export const userShema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },

        timestamps: true,
        versionKey: false,

    });

User.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

export const User = model('User', userShema);   
