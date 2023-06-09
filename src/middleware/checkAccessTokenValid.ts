export const checkTokenIsValid = (req, res, next) => {
    if (Date.now() >= req.session.cookie._expires) {
        // refresh token
        req.session.redirectURL = req.originalUrl;

        res.redirect("/auth/refresh");
    } else {
        next();
    }
};
