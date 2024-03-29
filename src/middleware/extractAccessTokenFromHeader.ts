export const extractAccessTokenFromHeader = (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            return next({
                success: false,
                status: 400,
                message: "There was no access token sent with your request, please try again.",
            })
        }

        res.locals.accessToken = req.headers.authorization
        next()
    } catch(error) {
        console.log(error)

        next({
            success: false,
            status: 500,
            message: "There was an error extracting the access token from your request",
        })
    }
};