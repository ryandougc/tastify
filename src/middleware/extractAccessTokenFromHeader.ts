export const extractAccessTokenFromHeader = (req, res, next) => {
    if(!req.headers.accessTokenuthorization) {
        next({
            success: false,
            status: 401,
            message: "You forgot to add the access token with your request",
        })
    }

    req.session.accessToken = req.headers.Authorization
    next()
};