import jwt from "jsonwebtoken";
import { USER_ACCESS_TOKEN_SECRET_KEY, USER_REFRESH_TOKEN_SECRET_KEY, SYSTEM_ACCESS_TOKEN_SECRET_KEY, SYSTEM_REFRESH_TOKEN_SECRET_KEY, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "../../../../config/config.service.js";
import { findOne } from "../../../DB/DB.service.js";
import { User } from "../../../modules/users/users.model.js";
import { NotFoundException, ConflictException, BadRequestException } from "../../utils/response/index.js";
import { TokenTypeEnum } from "../../../common/enums/index.js";
import { roleEnum } from "../../../common/enums/index.js";


export const generateToken = async ({ payload = {}, secret = USER_ACCESS_TOKEN_SECRET_KEY, options = {} } = {}) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = async ({ token, secret = USER_ACCESS_TOKEN_SECRET_KEY } = {}) => {
  return jwt.verify(token, secret);
};

export const detectSignatureLevel = async (level) => {
  let signature = { accessSignature: undefined, refreshSignature: undefined }
  switch (level) {
    case roleEnum.Admin:
      signature = { accessSignature: SYSTEM_ACCESS_TOKEN_SECRET_KEY, refreshSignature: SYSTEM_REFRESH_TOKEN_SECRET_KEY }
      break;
    default:
      signature = { accessSignature: USER_ACCESS_TOKEN_SECRET_KEY, refreshSignature: USER_REFRESH_TOKEN_SECRET_KEY }
      break;
  }
  return signature
}


export const getTokenSignature = async ({ tokenType = TokenTypeEnum.Access, level } = {}) => {
  const { accessSignature, refreshSignature } = await detectSignatureLevel(level);
  let signature = undefined;
  switch (tokenType) {
    case TokenTypeEnum.Refresh:
      signature = refreshSignature;
      break;

    default:
      signature = accessSignature
      break;
  }
  return signature
}



export const decodeToken = async ({ token, tokenType = TokenTypeEnum.Access } = {}) => {
  const decodeToken = jwt.decode(token);
  console.log({ decodeToken });
  if (!decodeToken?.aud?.length) {
    throw BadRequestException({ message: "missing token audience" })

  }
  const [tokenApproach, level] = decodeToken.aud;
  if (tokenType !== tokenApproach) {
    throw ConflictException({ message: `Unexpected token mechanism we expected ${tokenType} while you have used ${tokenApproach}` })
  }
  const secret = await getTokenSignature({ tokenType: tokenApproach, level })

  const verifiedData = jwt.verify(token, secret);
  console.log({ verifiedData });
  const user = await findOne({ model: User, filter: { _id: verifiedData.sub } });
  if (!user) {
    throw NotFoundException({ message: "Not register account" })
  }
  return user
}

export const createLoginCredentials = async (user, issuer) => {
  const { accessSignature, refreshSignature } = await detectSignatureLevel(user.role);

  const access_token = jwt.sign(
    { sub: user._id, extra: 250 }, // ✅ payload
    accessSignature, // ✅ secret
    {
      issuer,
      audience: [TokenTypeEnum.Access, user.role],
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    }
  );

  const refresh_token = jwt.sign(
    { sub: user._id, extra: 250 }, // ✅ payload
    refreshSignature, // ✅ secret
    {
      issuer,
      audience: [TokenTypeEnum.Refresh, user.role],
      expiresIn: REFRESH_TOKEN_EXPIRES_IN
    }
  );

  return { access_token, refresh_token };
};