import express from "express";
import { authenticateDB, connectRedis  } from "./DB/models/index.js";
import { PORT } from "../config/config.service.js";
import { userRouter } from "./modules/users/index.js";
import { authRouter } from "./modules/auth/index.js";
import { globalErrorHandling, sendEmail } from "./common/utils/index.js";
import { resolve } from 'path';
import cors from "cors";

export const bootstrap = async (port) => {
  const app = express();

  // Parse JSON
  app.use(cors(), express.json());
   app.use("/uploads", express.static(resolve("../uploads")));

  // DB Connection
  await authenticateDB();
  await connectRedis();


  // Home route
  app.get("/", (req, res) => {
    return res.status(200).json({
      message: "DB Connection Success..."
    });
  });


  app.use("/auth", authRouter);
  app.use("/users", userRouter);

  app.use((req, res) => {
    res.status(404).json({
      message: `404 URL ${req.originalUrl} Not Found`
    });
  });


  /*
    app.use('{/*dummy}', (req, res) => {
      res.status(404).json({
        message: `404 URL ${req.originalUrl} Not Found`
      });
    });
    */
  app.use(globalErrorHandling);
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};