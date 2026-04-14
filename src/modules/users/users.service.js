import { createLoginCredentials, generateDecryption, NotFoundException } from '../../common/utils/index.js';
import { find } from '../../DB/DB.service.js';
import { User } from "./users.model.js";
import { create, deleteOne } from "../../DB/DB.service.js";
import { LogoutEnum } from '../../common/utils/index.js';
import { tokenModel } from "../../DB/models/token.model.js";
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "../../../config/config.service.js";
import { BadRequestException, ConflictException } from "../../common/utils/response/index.js";

export const logout = async ({flag}, user, { jti, iat }) => {
  let status = 200;
 
  switch (flag) {
    case LogoutEnum.All:
      user.changeCredentialsTime = new Date();
      await user.save();
      await deleteOne({ model: tokenModel, filter: { userId: user._id } });
      break;

    default:
     const expireAt= new Date((iat + REFRESH_TOKEN_EXPIRES_IN) * 1000)
      await create({
        model: tokenModel,
        data: {
          userId: user._id,
          jti,
          expiresIn: expireAt
        }
      });

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

export const rotateToken = async (user,{ jti, iat }, issuer) => {

   /* if ((iat + ACCESS_TOKEN_EXPIRES_IN) * 1000 >= Date.now()) {
    throw ConflictException({ message: "Current access token still valid" });
  }*/

  await createOne({
    model: tokenModel,
    data: {
      userId: user._id,
      jti,
      expiresIn: new Date((iat + ACCESS_TOKEN_EXPIRES_IN) * 1000)
    }
  });
  return createLoginCredentials(user, issuer);
}

export const profile = async (user) => {
  return user;
}

/*
export const updateUser = async (id, updateData) => {
  try {
    // Prevent password updates
    if (updateData.password) {
      throw new Error("Password cannot be updated here");
    }

    // If email is being updated, check uniqueness first
    if (updateData.email) {
      const existingEmail = await User.findOne({ email: updateData.email });
      if (existingEmail && existingEmail._id.toString() !== id) {
        throw new Error("Email already exists");
      }
    }

    // Now perform the update
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    ).select("-password").lean(); // Exclude password from returned user

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteUser = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id);   
    if (!deletedUser) {
      throw new Error("User not found");
    }
    return deletedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUser = async (id) => {
  try {
    const user = await User.findById(id).lean();
    return user;
    } catch (error) {
    throw new Error(error.message);
  } 
};


export const GetUser = async (id) => {
  try {
    const user = await User.findById(id).lean();
    return user;
  } catch (error) {
    throw new Error(error.message);
  } 
};


*/

