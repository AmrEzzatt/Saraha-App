import { decodeToken } from "../common/utils/security/token.security.js";
import { TokenTypeEnum } from "../common/enums/index.js";
import { UnauthorizedException } from "../common/utils/response/index.js";



export const authentication = (tokenType = TokenTypeEnum.Access) => {
  return async (req, res, next) => {
    const [key, credentials] = req.headers.authorization.split(" ") || [];
    
    if (!key || !credentials) {
      throw UnauthorizedException({ message: "missing authorization header" })
    }

  
        const {user,decoded} = await decodeToken({ token: credentials, tokenType });
        req.user = user;
        req.decoded = decoded;  
        next()
  }
}  


export const authorization = (accessRoles = []) => {
  return (req, res, next) => {

    // 1️⃣ Check role
    if (!accessRoles.includes(req.user.role)) {
      return next(ForbiddenException({ message: "Not authorized account" }));
    }

    // 2️⃣ Allow request to continue
    next();
  };
};