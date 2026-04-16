import { ConflictException, createLoginCredentials, generateDecryption, NotFoundException } from '../../common/utils/index.js';
import { find } from '../../DB/models/DB.service.js';
import { User } from "./users.model.js";
import { LogoutEnum } from '../../common/utils/index.js';
import { set ,revokeTokenKey,baseRevokeTokenKey, deleteKey, allKeysByPrefix} from "../../common/services/redis.service.js";
import {  REFRESH_TOKEN_EXPIRES_IN } from "../../../config/config.service.js";

const createRevokeToken = async ({userId, jti, iat}) => {
  await set({
    key :revokeTokenKey({userId, jti}),
    value: jti,
    ttl
  });
  return;
}


export const logout = async ({flag}, user, { jti, iat,sub }) => {
  let status = 200;
 
  switch (flag) {
    case LogoutEnum.All:
      user.changeCredentialsTime = new Date();
      await user.save();
      await deleteKey(await allKeysByPrefix(`${baseRevokeTokenKey(sub)}::*`));
      
      break;

    default:
    await createRevokeToken({userId: sub, jti, iat: iat + REFRESH_TOKEN_EXPIRES_IN});

      status = 201;
      break;
  }

  return status;
};


export const ProfileImage = async (user, file) => {
  user.profilePicture = file.finalPath;
  await user.save();
  return user;
}

export const coverProfilePicture = async (user, files) => {
  user.coverProfilePicture = files.map(file => file.finalPath);
  await user.save();
  return user;
};


export const shareProfile = async (id) => {
  const user = await find({ model: User, filter: { _id: id }, select: "-password", options: { lean: true } });
  if (!user) {
    throw NotFoundException({ message: "Not found user" })
  }

  if (user.phone) {
    user.phone = await generateDecryption(user.phone);
  }
  return user;

};

export const rotateToken = async (user,{sub, jti, iat }, issuer) => {

    if((iat + REFRESH_TOKEN_EXPIRES_IN)*1000 >= Date.now()*1000)
       {
        throw ConflictException({ message: "Token is not expired yet" })
       }
   await createRevokeToken({userId: sub, jti, iat: iat + REFRESH_TOKEN_EXPIRES_IN});

  return createLoginCredentials(user, issuer);
}

export const profile = async (user) => {
  return user;
}

