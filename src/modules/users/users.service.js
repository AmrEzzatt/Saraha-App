import {  createLoginCredentials} from '../../common/utils/index.js';




export const rotateToken = async (user, issuer) => {
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

