import { Router } from "express";
import * as service from "./users.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { successResponse, BadRequestException, ConflictException, UnauthorizedException, NotFoundException, ForbiddenException } from "../../common/utils/response/index.js";
export const userRouter = Router();

/*Singnup*/
userRouter.post("/signup", async (req, res) => {
  try {
    const newUser = await service.signUp(req.body);
    successResponse({ res, data: newUser });
  } catch (error) {
    ConflictException({ res, message: error.message, status: 409 });
  }
});
/*
/*Login*/

userRouter.post("/login", async (req, res) => {
  try {
    // Construct full base URL as issuer
    const issuer = `${req.protocol}://${req.get('host')}`; // e.g., https://localhost:3000

    const user = await service.login(req.body, issuer);
    successResponse({ res, data: user });
  } catch (error) {
    BadRequestException({ res, message: error.message, status: 400 });
  }
});


userRouter.get("/profile", async (req, res, next) => {
  try {
    const account = await service.profile(req.headers.authorization)
    console.log(req.headers.authorization)
    successResponse({ res, data: { account } });
  } catch (error) {
    BadRequestException({ res, message: error.message, status: 400 });
  }
});


userRouter.get("/rotate-router", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const issuer = `${req.protocol}://${req.get('host')}`; // e.g., https://localhost:3000
    const data = await service.rotateToken(token, issuer);
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