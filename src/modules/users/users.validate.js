import joi from 'joi';
import { genralValidationFields } from '../../common/utils/validation.js';
import { fileFieldValidation } from '../../common/utils/multer/index.js';
export const shareProfile = {
    params: joi.object().keys({
        userId: genralValidationFields.id.required()
    }).required()
}

export const profileImage = {
file: genralValidationFields.file(fileFieldValidation.image).required()

}

export const profileCoverImage = {
files: joi.array().items(
genralValidationFields.file(fileFieldValidation. image) . required()
).min(1).max(5).required()
}
export const profileAttachments = {
                files: joi.object().keys({
                profileImage:
                joi.array().items(
                genralValidationFields.file(fileFieldValidation.image).required()
                ).length(1).required(),
                profileCoverImage:
                joi.array().items(
                genralValidationFields.file(fileFieldValidation.image).required()
                ).min(1).max(5).required(),

}).required()
}