import { validationResult } from "express-validator";

export const checkErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next({
            success: false,
            status: 400,
            message: errors.array(),
        });
    }

    return next();
};
