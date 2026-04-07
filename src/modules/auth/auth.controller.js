import { Router } from "express";
import * as service from "./auth.service.js";
import * as validator from "./auth.validation.js";
import { validation } from "../../middlewares/index.js";
import {
    successResponse,
    BadRequestException,
    ConflictException
} from "../../common/utils/response/index.js";

export const authRouter = Router();

authRouter.post("/signup", validation(validator.signup), async (req, res) => {
    try {
        const newUser = await service.signUp(req.body);
        return successResponse({ res, data: newUser, status: 201 });
    } catch (error) {
        if (error.code === 11000) {
            ConflictException({ message: "Email already exists", extra: error });
        }
        throw error;
    }
});

authRouter.post("/signup/gmail", validation(validator.gmailAuth), async (req, res) => {
    try {
        const { status, credentials } = await service.signUpWithGmail(
            req.body.idToken,
            `${req.protocol}://${req.get("host")}`
        );

        return successResponse({ res, status, data: { ...credentials } });
    } catch (error) {
        BadRequestException({ message: error.message, extra: error });
    }
});

authRouter.post("/login", validation(validator.login), async (req, res) => {
    try {
        const issuer = `${req.protocol}://${req.get("host")}`;
        const user = await service.login(req.body, issuer);
        return successResponse({ res, data: user });
    } catch (error) {
        BadRequestException({ message: error.message, extra: error });
    }
});
