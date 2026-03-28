/*import jwt from "jsonwebtoken";
import { JWT_SECRET,JWT_EXPIRES_IN } from "../../../../config/config.service.js";

export const generateToken = (playload) => {
  return jwt.sign(playload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};*/
import jwt from "jsonwebtoken";
import { USER_ACCESS_TOKEN_SECRET_KEY,USER_REFRESH_TOKEN_SECRET_KEY } from "../../../../config/config.service.js"


export const createLoginCredentials = async (user,issuer)=>{

     const access_token=jwt.sign(
      {sub:user._id,extra:250},
      USER_ACCESS_TOKEN_SECRET_KEY,
      {
        issuer,
        audience: ['web','mobile'],
        expiresIn : '15m'
      }
     )

      const refresh_token=jwt.sign(
      {sub:user._id,extra:250},
      USER_REFRESH_TOKEN_SECRET_KEY,
      {
        issuer,
        audience: ['web','mobile'],
        expiresIn : "1y"
      }
    )
    return {access_token,refresh_token}


}