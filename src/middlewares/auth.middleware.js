import { decodeToken } from "../common/utils/security/token.security.js";
import { TokenTypeEnum } from "../common/enums/index.js";
import { UnauthorizedException } from "../common/utils/response/index.js";



export const authentication = (tokenType = TokenTypeEnum.Access) => {
  return async (req, res, next) => {
    const [schema, credentials] = req.headers.authorization.split(" ") || [];
    console.log({ authorization, schema, credentials });
    if (schema !== "Bearer" || !credentials) {
      throw UnauthorizedException({ message: "missing authorization header or invalid schema" })
    }
    req.user = await decodeToken({ token: credentials, tokenType })
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