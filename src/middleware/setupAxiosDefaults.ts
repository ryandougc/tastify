import axios from 'axios'

export const setupAxiosDefaults = async (req, res, next) => {
    try {
        if(!res.locals.accessToken) {
            return next({
                success: false,
                status: 400,
                message: "There was no access token sent with your request, please try again.",
            })
        }

        axios.defaults.headers.common["Authorization"] = res.locals.accessToken
        axios.defaults.responseType = "json";

        next()
    } catch(error) {
        console.log(error)

        next({
            success: false,
            status: 500,
            message: "There was an error with your access token, please try again.",
        })
    }
};