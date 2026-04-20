import joi from "joi";
import { genralValidationFields } from "../../common/utils/validation.js";
export const login = {
    body: joi.object().keys({
        email: genralValidationFields.email.required(),
        password: genralValidationFields.password.required()
    }).required()
};


export const signup = {
    body: login.body.append().keys({
        userName: genralValidationFields.userName.required(),
        confirmPassword: genralValidationFields.confirmPassword("password").required(),
        phone: genralValidationFields.phone.required()
    }).required(),

}

export const comfirmEmail = {
    body: joi.object().keys({
        email: genralValidationFields.email.required(),
        otp: genralValidationFields.otp.required()
    }).required()
};
