import {resolve} from 'path';
import {config} from 'dotenv';

export const Node_ENV = process.env.NODE_ENV ?? "development";

const envPath={
    development:`.env.development`,
    production:`.env.production`,
};
config({ path: resolve(`./config/${envPath[Node_ENV] ?? ".env.development"}`) });

export const  PORT = process.env.PORT ?? 9000

export const DB_URI = process.env.DB_URI 
export const DB_NAME = process.env.DB_NAME 

 export const JWT_SECRET = process.env.JWT_SECRET;
 export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
 export const ENC_SECRET = Buffer.from(process.env.ENC_SECRET);

export const IV_LENGTH = parseInt(process.env.IV_LENGTH??'16');
export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS??'10');

export const USER_ACCESS_TOKEN_SECRET_KEY=process.env.USER_ACCESS_TOKEN_SECRET_KEY;
export const USER_REFRESH_TOKEN_SECRET_KEY=process.env.USER_REFRESH_TOKEN_SECRET_KEY;


if (!USER_ACCESS_TOKEN_SECRET_KEY || !USER_REFRESH_TOKEN_SECRET_KEY) {
  console.error("❌ JWT secrets must be set in environment variables"); 
}