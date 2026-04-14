import joi from "joi";
import { Types } from 'mongoose';

export const genralValidationFields = {
    email: joi.string().pattern(RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')),
    password: joi.string().pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{1,16}$/),

    userName: joi.string().pattern(RegExp('^[A-Z]{1}[a-z]{1,24}\\s[A-Z]{1}[a-z]{1,24}$')).required().messages({
        "string.empty": "User name is empty",
        "any.required": "User name is required"
    }),

    confirmPassword: function (path = "password") {
        return joi.string().valid(joi.ref(path));
    },

    phone: joi.string().pattern(RegExp('^(0201|\\+201|01)(0|1|2|5)\\d{8}$')),

    id: joi.string().custom((value, helper) => {
        return Types.ObjectId.isValid(value) ? true : helper.message("Invalid objectId")
    }),

    file: function (validation = []) {
        return joi.object().keys({
            "fieldname": joi.string().required(),
            "originalname": joi.string().required(),
            "encoding": joi.string().required(),
            "mimetype": joi.string().valid(...validation).required(),
            "finalPath": joi.string().required(),
            "destination": joi.string().required(),
            "filename": joi.string().required(),
            "path": joi.string().required(),
            "size": joi.number().required(),
        });
    }
             

} 

