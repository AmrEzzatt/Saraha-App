# Saraha App Backend

Backend API for a Saraha-style anonymous messaging app built with Node.js, Express, MongoDB, and Redis.

## Overview

This project provides:

- Authentication with email/password
- Google sign up
- JWT access and refresh tokens
- User profile and share-profile endpoints
- Profile image and cover image upload
- Redis-backed token revocation helpers

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- Redis
- JWT
- bcrypt
- Joi
- multer
- dotenv

## Project Structure

```text
src/
  app.bootstrap.js
  main.js
  DB/
    models/
  common/
    enums/
    services/
    utils/
  middlewares/
  modules/
    auth/
    users/
config/
  .env.development
  .env.production
  config.service.js
```

## Available Scripts

```bash
npm run start:dev
npm run start:prod
```

`start:dev` runs the app with `NODE_ENV=development` and watches `src/main.js`.

## Environment Variables

The app loads environment variables from:

- `config/.env.development` when `NODE_ENV=development`
- `config/.env.production` when `NODE_ENV=production`

Required variables:

```env
PORT=3000
DB_URI=your_mongodb_connection_string
DB_NAME=Saraha_App_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h

ENC_SECRET=your_encryption_secret
IV_LENGTH=16
SALT_ROUNDS=10

USER_ACCESS_TOKEN_SECRET_KEY=your_user_access_secret
USER_REFRESH_TOKEN_SECRET_KEY=your_user_refresh_secret
SYSTEM_ACCESS_TOKEN_SECRET_KEY=your_system_access_secret
SYSTEM_REFRESH_TOKEN_SECRET_KEY=your_system_refresh_secret

ACCESS_TOKEN_EXPIRES_IN=3600
REFRESH_TOKEN_EXPIRES_IN=604800

REDIS_URI=rediss://default:password@host:6379
```

Note:

- `ACCESS_TOKEN_EXPIRES_IN` and `REFRESH_TOKEN_EXPIRES_IN` are parsed with `parseInt(...)`, so they should be numeric values in seconds.
- Do not write values like `60 * 60` inside `.env` files.

## Getting Started

```bash
git clone <your-repo-url>
cd Code
npm install
npm run start:dev
```

When the app starts successfully, it connects to MongoDB and Redis, then listens on:

```text
http://localhost:3000
```

## API Routes

Base routes configured in [src/app.bootstrap.js](/e:/route backend/training/Saraha App/Code/src/app.bootstrap.js:1):

- `/auth`
- `/users`

Authentication routes:

- `POST /auth/signup`
- `POST /auth/signup/gmail`
- `POST /auth/login`

User routes:

- `POST /users/logout`
- `PATCH /users/profile-image`
- `PATCH /users/cover-profile-image`
- `GET /users/:userId/share-profile`
- `GET /users/profile`
- `GET /users/rotate-router`

## Redis Usage

Redis is used for token revocation support.

Connection setup lives in [src/DB/models/redis.connection.js](/e:/route backend/training/Saraha App/Code/src/DB/models/redis.connection.js:1), and helper functions live in [src/common/services/redis.service.js](/e:/route backend/training/Saraha App/Code/src/common/services/redis.service.js:1).

## Notes

- The app uses ES modules (`"type": "module"` in `package.json`).
- Uploaded files are served from `/uploads`.
- CORS and JSON body parsing are enabled globally.
