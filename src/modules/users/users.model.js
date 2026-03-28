import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
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
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
             validate: {
        validator: function (v) {
          return v >= 18 && v <= 60;
        },
        message: "Age should be between 18 and 60",
      },
            
        }
},
   {
    strict: true,
     optimisticConcurrency: true ,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
   }
);

// Virtuals: split fullName into firstName and secondName
userSchema.virtual("firstName").get(function () {
  return this.fullName?.split(" ")[0] || "";
});

userSchema.virtual("secondName").get(function () {
  return this.fullName?.split(" ")[1] || "";
});


export const User = mongoose.model("User", userSchema)|| mongoose.models.User;  
