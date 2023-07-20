import axios from 'axios'

export const getUserProfileFromAccessToken = async (req, res, next) => {
    if(!res.locals.accessToken) {
        next({
            success: false,
            status: 401,
            message: "You forgot to add the access token with your request",
        })
    }

    const profile = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me",
        headers: {
            Authorization: res.locals.accessToken,
        },
        responseType: "json",
    });

    // If this fails, return a 401 unauthorized error and tell the user to refresh their token

    res.locals.profileId = profile.data.id

    next()
};