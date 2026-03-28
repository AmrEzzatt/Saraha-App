import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../../../../config/config.service.js';
export const generateHash = async (plainText) => {
  const Salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(plainText, Salt);
};

export const compareHash = async (plainText, hashedText) => {
  return await bcrypt.compare(plainText, hashedText);
}

