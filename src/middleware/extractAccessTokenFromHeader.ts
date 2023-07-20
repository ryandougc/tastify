export const extractAccessTokenFromHeader = (req, res, next) => {
    if(!req.headers.authorization) {
        next({
            success: false,
            status: 401,
            message: "You forgot to add the access token with your request",
        })
    }

    res.locals.accessToken = req.headers.authorization
    next()
};