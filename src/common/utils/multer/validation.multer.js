import multer from "multer";
import { resolve } from "node:path";
import { existsSync, mkdirSync } from "node:fs";

// ✅ Allowed file types
export const fileFieldValidation = {
  image: ["image/jpeg", "image/jpg", "image/png"],
  video: ["video/mp4"]
};

// ✅ File filter function for Multer
export const fileFilter = (validation = []) => {
  return function (req, file, cb) {
    if (!validation.includes(file.mimetype)) {
      // Reject invalid file
      return cb(new Error("Invalid file format", { cause: { status: 400 } }), false);
    }

    // Accept valid file
    cb(null, true);
  };
};