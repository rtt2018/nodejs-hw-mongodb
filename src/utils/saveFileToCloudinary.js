import cloudinary from 'cloudinary';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
    secure: true,
    cloud_name: CLOUDINARY.CLOUD_NAME,
    api_key: CLOUDINARY.API_KEY,
    api_secret: CLOUDINARY.API_SECRET,
});

export function uploadToCloudinary(filePath) {
    return cloudinary.v2.uploader.upload(filePath);
}