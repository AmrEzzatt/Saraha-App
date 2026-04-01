import crypto from "node:crypto";
import { ENC_SECRET, IV_LENGTH } from "../../../../config/config.service.js";



export const generateEncryption = async (plaintext) => {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipherIV = crypto.createCipheriv("aes-256-cbc", ENC_SECRET, iv);
  let cipherText = cipherIV.update(plaintext, "utf8", "hex");
  cipherText += cipherIV.final("hex");
  //console.log(iv,{ivt:iv.toString('hex')},cipherIV,cipherText);
  return `${iv.toString('hex')}:${cipherText}`

};


export const generateDecryption = async (cipherText) => {
  const { iv, encryptedData } = cipherText.split(":") || {}
  const decipherIV = crypto.createDecipheriv("aes-256-cbc", ENC_SECRET, iv);
  const ivLikeBInary = Buffer.from(iv, 'hex')
  let plainText = decipher.update(encryptedData, "hex", "utf8");
  plainText += decipher.final("utf8");
  // console.log({iv,encryptedData,ivLikeBinary,decipherIV,plain})
  return plainText;
};