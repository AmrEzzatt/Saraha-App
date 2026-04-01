import { Router } from "express";
import * as service from "./auth.service.js";
import { successResponse, BadRequestException, ConflictException, UnauthorizedException, NotFoundException, ForbiddenException } from "../../common/utils/response/index.js";
export const authRouter = Router();



/*Singnup*/
authRouter.post("auth/signup", async (req, res) => {
    try {
        const newUser = await service.signUp(req.body);
        successResponse({ res, data: newUser });
    } catch (error) {
        ConflictException({ res, message: error.message, status: 409 });
    }
});
/*signupWithGmail*/
authRouter.post("/signup/gmail", async (req, res) => {
    try {
        const { status, credentials } = await service.signUpWithGmail(req.body.idToken, `${req.protocol}://${req.get('host')}`);
        successResponse({ res, status, data: { ...credentials } });
    } catch (error) {
        ConflictException({ res, message: error.message, status: 409 });
    }
});

/*Login*/

authRouter.post("auth/login", async (req, res) => {
    try {
        // Construct full base URL as issuer
        const issuer = `${req.protocol}://${req.get('host')}`; // e.g., https://localhost:3000

        const user = await service.login(req.body, issuer);
        successResponse({ res, data: user });
    } catch (error) {
        BadRequestException({ res, message: error.message, status: 400 });
    }
});
