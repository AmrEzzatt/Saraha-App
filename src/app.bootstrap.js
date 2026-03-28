import express from "express";
import { authenticateDB } from "./DB/connectionDB.js";
import {PORT } from "../config/config.service.js";
import { userRouter } from "./modules/users/index.js";
import { globalErrorHandling } from "./common/utils/index.js";

export const bootstrap = async () => {
  const app = express();

  // Parse JSON
  app.use(express.json());

  // DB Connection
  await authenticateDB();

 
  // Home route
  app.get("/", (req, res) => {
    return res.status(200).json({
      message: "DB Connection Success..."
    });
  });
app.use("/users", userRouter);


  app.use('{/*dummy}', (req, res) => {
    res.status(404).json({
      message: `404 URL ${req.originalUrl} Not Found`
    });
  });
app.use(globalErrorHandling);
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
