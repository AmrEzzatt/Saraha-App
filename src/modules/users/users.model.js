import mongoose from "mongoose";
import { providerEnum, roleEnum } from "../../common/enums/user.enum.js";
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return this.provider == providerEnum.system
    }
  },
  phone: {
    type: String,
    required: function () {
      return this.provider == providerEnum.system
    },
  },
  age: {
    type: Number,
    validate: {
      validator: function (v) {
        return v >= 18 && v <= 60;
      },
      message: "Age should be between 18 and 60",
    },

  },
  profilePicture: {
    type: String,
  },
  provider: {
    type: Number,
    enum: Object.values(providerEnum),
    default: providerEnum.system
  },
  role: {
    type: Number, 
    enum: Object.values(roleEnum),
    default: roleEnum.Admin
  }
},
  {
    strict: true,
    optimisticConcurrency: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtuals: split fullName into firstName and secondName
userSchema.virtual("firstName").get(function () {
  return this.userName?.split(" ")[0] || "";
});

userSchema.virtual("secondName").get(function () {
  return this.userName?.split(" ")[1] || "";
});


export const User = mongoose.model("User", userSchema) || mongoose.models.User;  
