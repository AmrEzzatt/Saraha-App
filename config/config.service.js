import { resolve } from 'path';
import { config } from 'dotenv';

export const Node_ENV = process.env.NODE_ENV ?? "development";

const envPath = {
  development: `.env.development`,
  production: `.env.production`,
};
config({ path: resolve(`./config/${envPath[Node_ENV] ?? ".env.development"}`) });


export const PORT = process.env.PORT ?? 9000

export const DB_URI = process.env.DB_URI;
export const App_Name = process.env.App_Name;

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const ENC_SECRET = Buffer.from(process.env.ENC_SECRET ?? "");

export const IV_LENGTH = parseInt(process.env.IV_LENGTH ?? '16');
export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? '10');

export const USER_ACCESS_TOKEN_SECRET_KEY = process.env.USER_ACCESS_TOKEN_SECRET_KEY;
export const USER_REFRESH_TOKEN_SECRET_KEY = process.env.USER_REFRESH_TOKEN_SECRET_KEY;

export const SYSTEM_ACCESS_TOKEN_SECRET_KEY = process.env.SYSTEM_ACCESS_TOKEN_SECRET_KEY;
export const SYSTEM_REFRESH_TOKEN_SECRET_KEY = process.env.SYSTEM_REFRESH_TOKEN_SECRET_KEY;

export const ACCESS_TOKEN_EXPIRES_IN = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN);
export const REFRESH_TOKEN_EXPIRES_IN = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN);
export const REDIS_URI = process.env.REDIS_URI;

export const EMAIL_App = process.env.EMAIL_App;
export const Email_App_password = process.env.Email_App_password;

export const Facebook_Link = process.env.Facebook_Link;
export const Instagram_Link = process.env.Instagram_Link;
export const Twitter_Link = process.env.Twitter_Link;