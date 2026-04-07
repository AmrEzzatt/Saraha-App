import { BadRequestException } from "../common/utils/response/index.js";

export const validation = (schema) => {
    return (req, res, next) => {
        const erros = [];

        for (const key of Object.keys(schema) || []) {
            const validationResult = schema[key].validate(req[key], { abortEarly: false });

            if (validationResult.error) {
                erros.push({
                    key,
                    details: validationResult.error.details.map(ele => {
                        return { message: ele.message, path: ele.path };
                    })
                });
            }
        }

        if (erros.length) {
            throw BadRequestException({ message: "Validation error", extra: erros });
        }

        next();
    };
};