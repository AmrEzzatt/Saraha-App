import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { fileFilter } from './validation.multer.js';
import multer from 'multer';

export const localFileUpload = ({customPath = "general",validation=[],maxfileSize=10}={}) => {

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
     const fullPath = resolve(`../uploads/${customPath}`);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
      cb(null, resolve(fullPath));
    },

    filename: function (req, file, cb) {
      const uniqueFileName = randomUUID() + "_" + file.originalname;
       file.finalPath = resolve(`../uploads/${customPath}/${uniqueFileName}`);
      cb(null, uniqueFileName);
    }
  });

  return multer({ fileFilter: fileFilter(validation), storage,limits: { fileSize: 1024 * 1024 * maxfileSize }});
};