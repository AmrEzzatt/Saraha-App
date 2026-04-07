import joi from 'joi';
import { genralValidationFields } from '../../common/utils';
export const shareProfile = {
params: joi. object().keys({
userId: genralValidationFields.id.required()
}) .required ()
}