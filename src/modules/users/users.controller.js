import { Router } from "express";
import * as service from "./users.service.js";
import { authentication, authorization } from "../../middlewares/auth.middleware.js";
import { successResponse, BadRequestException, ConflictException, UnauthorizedException, NotFoundException, ForbiddenException } from "../../common/utils/response/index.js";
import { TokenTypeEnum } from "../../common/enums/index.js";
import { endPoint } from "./users.authorization.js";
export const userRouter = Router();


userRouter.get("/:userId/share-profile", async (req, res) => {
  try {
    const user = await service.shareProfile(req.params.userId);
    successResponse({ res, data: user });
  } catch (error) {
    NotFoundException({ res, message: error.message, status: 404 });
  }
});


userRouter.get("/profile", authentication(), authorization(endPoint.profile), async (req, res) => {
  try {
    const account = await service.profile(req.user)
    successResponse({ res, data: { account } });
  } catch (error) {
    BadRequestException({ res, message: error.message, status: 400 });
  }
});


userRouter.get("/rotate-router", authentication(TokenTypeEnum.Refresh), async (req, res) => {
  try {
    const issuer = `${req.protocol}://${req.get('host')}`; // e.g., https://localhost:3000
    const data = await service.rotateToken(req.user, issuer);
    successResponse({ res, data: data });
  } catch (error) {
    NotFoundException({ res, message: error.message, status: 404 });
  }
})


















/*
userRouter.patch("/", authMiddleware, async (req, res) => {
  try {
    const updatedUser = await service.updateUser(req.userId, req.body);
    successResponse({ res, data: updatedUser, message: "User updated successfully" });
  } catch (error) {
    UnauthorizedException({ res, message: error.message, status: 401 });
  }
});

// Delete logged-in user
userRouter.delete("/", authMiddleware, async (req, res) => {
  try {
    const result = await service.deleteUser(req.userId);
    successResponse({ res, data: result, message: "User deleted successfully" });
  } catch (error) {
    NotFoundException({ res, message: error.message, status: 404 });
  }
});

// Get logged-in user
userRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await service.getUser(req.userId);
    successResponse({ res, data: user });
  } catch (error) {
    NotFoundException({ res, message: error.message, status: 404 });
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const user = await service.GetUser(req.params.id);
    successResponse({ res, data: user }); // message defaults to "Done"
  } catch (error) {
    NotFoundException({ res, message: error.message, status: 404 });
  }
});
*/
