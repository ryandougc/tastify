import axios from 'axios'

export const getUserProfileFromAccessToken = async (req, res, next) => {
    try {
        if(!res.locals.accessToken) {
            return next({
                success: false,
                status: 400,
                message: "There was no access token sent with your request, please try again.",
            })
        }

        const profileResponse = await axios({
            method: "GET",
            url: "https://api.spotify.com/v1/me",
            headers: {
                Authorization: res.locals.accessToken,
            },
            responseType: "json",
        });

        res.locals.spotifyUsername = profileResponse.data.id

        next()
    } catch(error) {
        if(error.response.status === 401) {
            return next({
                 success: false,
                 status: 401,
                 message: "Your access token is invalid, please refresh your token and try again.",
             })
         } 
            
        console.log(error)

        next({
            success: false,
            status: 500,
            message: "There was an error with your access token, please try again.",
        })
    }
};