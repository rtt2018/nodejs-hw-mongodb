import path from 'node:path';
import { getEnvVar } from '../utils/getEnvVar.js';

export const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc',
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const CLOUDINARY = {
    CLOUD_NAME: getEnvVar('CLOUDINARY_NAME'),
    API_KEY: getEnvVar('CLOUDINARY_API_KEY'),
    API_SECRET: getEnvVar('CLOUDINARY_API_SECRET'),
};