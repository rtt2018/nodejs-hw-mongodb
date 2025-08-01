import { getEnvVar } from '../utils/getEnvVar.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { uploadToCloudinary } from '../utils/saveFileToCloudinary.js';
import { UPLOAD_TO_CLOUDINARY } from '../constants/index.js';

export async function savePhoto(req) {
    let photo = null;

    if (UPLOAD_TO_CLOUDINARY) {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path);
        photo = result.secure_url;
    } else {
        await fs.rename(
            req.file.path,
            path.resolve('src/uploads/photo', req.file.filename),
        );
        photo = `${getEnvVar('APP_DOMAIN')}/photo/${req.file.filename}`;
    }
    return photo;
}