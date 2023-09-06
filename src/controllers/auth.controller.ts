import * as queryString from "query-string";
import axios from "axios";

import { generateRandomString } from "../lib/utils";
import { checkUserProfileExists } from "../lib/dbDriver";
import { Profile } from "../models/Profile";

export const login = (req, res, next) => {
    const state = generateRandomString(16);
    const scope = "user-library-read user-top-read";

    req.session.returnPage = req.query.return_page
    req.session.save()

    // res.status(200).json({
    //     loginURI: "https://accounts.spotify.com/authorize?" +
    //         queryString.stringify({
    //             response_type: "code",
    //             client_id: process.env.SPOTIFY_CLIENT_ID,
    //             scope: scope,
    //             redirect_uri: process.env.REDIRECT_URL,
    //             state: state,
    //         })
    // });
    res.redirect("https://accounts.spotify.com/authorize?" +
        queryString.stringify({
            response_type: "code",
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: process.env.REDIRECT_URL,
            state: state,
        })
    )
};

export const callback = async (req, res, next) => {
    const state = req.query.state || null;
    const code = req.query.code || null;

    if (state === null) {
        res.redirect(
            "/#" +
            queryString.stringify({
                error: "state_mismatch",
            })
        );
    } else {
        try {
            let bodyFormData = await new URLSearchParams();

            bodyFormData.append("grant_type", "authorization_code");
            bodyFormData.append("code", code);
            bodyFormData.append("redirect_uri", process.env.REDIRECT_URL);

            const response = await axios({
                method: "POST",
                url: "https://accounts.spotify.com/api/token",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " +
                        Buffer.from(
                            process.env.SPOTIFY_CLIENT_ID +
                                ":" +
                                process.env.SPOTIFY_CLIENT_SECRET
                        ).toString("base64"),
                },
                data: bodyFormData,
                responseType: "json",
            });

            const accessToken = response.data.access_token;
            const refreshToken = response.data.refresh_token;

            const userData = await axios({
                method: "GET",
                url: "https://api.spotify.com/v1/me",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                responseType: "json",
            });

            const spotifyUsername = userData.data.id

            // If you user doesn't already exist in the database, create their profile
            const profileExists = await checkUserProfileExists(spotifyUsername)

            if(!profileExists) {
                const newProfile = new Profile(spotifyUsername)

                newProfile.save()
            }


            res.redirect(req.session.returnPage + '?' +       
                queryString.stringify({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    profileId: userData.data.id
                })
            )

            delete req.session.returnPage
        } catch (err) {
            console.log(err);

            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.query.refreshToken || null

        if(refreshToken === null) {
            return next({
                success: false,
                status: 401,
                message: "Looks like you forgot to add the refresh token to your request",
            });
        }

        let bodyFormData = new URLSearchParams();

        bodyFormData.append("grant_type", "refresh_token");
        bodyFormData.append("refresh_token", refreshToken);

        const response = await axios({
            method: "POST",
            url: "https://accounts.spotify.com/api/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    Buffer.from(
                        process.env.SPOTIFY_CLIENT_ID +
                            ":" +
                            process.env.SPOTIFY_CLIENT_SECRET
                    ).toString("base64"),
            },
            data: bodyFormData,
            responseType: "json",
        });

        res.status(200).send({
            accessToken: response.data.access_token,
            accessTokenExpiry: response.data.expires_in
        });
    } catch (err) {
        console.log(err);

        return next({
            success: false,
            status: 500,
            message: "Uh oh, something went wrong on our side",
        });
    }
};
