import * as queryString from "query-string";
import axios from "axios";

import { randomString } from "../lib/utils";

export const login = (req, res, next) => {
    req.session.state = randomString(16);

    const scope = "user-library-read user-top-read";

    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            queryString.stringify({
                response_type: "code",
                client_id: process.env.SPOTIFY_CLIENT_ID,
                scope: scope,
                redirect_uri: process.env.REDIRECT_URL,
                state: req.session.state,
            })
    );
};

export const callback = async (req, res, next) => {
    const state = req.query.state || null;
    const code = req.query.code || null;

    if (state === null || state !== req.session.state) {
        res.redirect(
            "/#" +
                queryString.stringify({
                    error: "state_mismatch",
                })
        );
    } else {
        try {
            delete req.session.state;

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

            req.session.access_token = response.data.access_token;
            req.session.refresh_token = response.data.refresh_token;

            const userData = await axios({
                method: "GET",
                url: "https://api.spotify.com/v1/me",
                headers: {
                    Authorization: `Bearer ${req.session.access_token}`,
                },
                responseType: "json",
            });

            req.session.userId = userData.data.id;

            res.send(response.data);
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
        let bodyFormData = new URLSearchParams();

        bodyFormData.append("grant_type", "refresh_token");
        bodyFormData.append("refresh_token", req.session.refresh_token);

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

        if (req.session.redirectURL) {
            return res.redirect(req.session.redirectURL);
        } else {
            return res.send(response.data);
        }
    } catch (err) {
        console.log(err);

        return next({
            success: false,
            status: 500,
            message: "Uh oh, something went wrong on our side",
        });
    }
};
