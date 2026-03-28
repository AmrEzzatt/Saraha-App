import { generateEncryption } from '../../common/utils/security/encryption.security.js';
import { generateHash, compareHash } from '../../common/utils/security/hash.js';
import { createLoginCredentials } from '../../common/utils/index.js'
import { User } from "./users.model.js";
import jwt from "jsonwebtoken";
import { USER_ACCESS_TOKEN_SECRET_KEY, USER_REFRESH_TOKEN_SECRET_KEY } from "../../../config/config.service.js"
import { findOne } from "../../DB/DB.service.js"



export const signUp = async (userData) => {
  try {
    // Prepare data object with transformations
    const data = {
      ...userData,
      password: await generateHash(userData.password),
      phone: await generateEncryption(userData.phone),
    };

    // Save new user (schema handles required + unique)
    const newUser = await User.create(data);
    return newUser;
  } catch (err) {
    // Handle duplicate email error from MongoDB
    if (err.code === 11000) {
      throw new Error("Email already exists");
    }
    throw new Error(err.message);
  }
};

export const login = async (userData, issuer) => {
  try {
    const { email, password } = userData;
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email');
    }
    const compare = await compareHash(password, user.password);
    if (!compare) {
      throw new Error('Invalid password');
    }
    return createLoginCredentials(user, issuer)
  } catch (err) {
    throw new Error(err.message);
  }
};

export const rotateToken = async (token, issuer) => {

  const decodeToken = jwt.decode(token);
  console.log({ decodeToken });
  const verifiedData = jwt.verify(token, USER_REFRESH_TOKEN_SECRET_KEY);
  console.log({ verifiedData });
  const user = await findOne({ model: User, filter: { _id: verifiedData.sub } });
  if (!user) {
    throw NotFoundException({ message: "Not register account" })
  }
  return createLoginCredentials(user, issuer)
}

export const profile = async (token) => {
  try {
    const decodeToken = jwt.decode(token);
    console.log({ decodeToken });
    const verifiedData = jwt.verify(token, USER_ACCESS_TOKEN_SECRET_KEY);
    console.log({ verifiedData });
    const user = await findOne({ model: User, filter: { _id: verifiedData.sub } });
    if (!user) {
      throw NotFoundException({ message: "Not register account" })
    }
    return user
  } catch (error) {
    throw new Error(error.message);
  }
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