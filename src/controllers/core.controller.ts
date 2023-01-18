import mongoose from "mongoose";
import * as queryString from "query-string";
import axios from "axios";

import { validateQueryString } from "../validators/validator";
import { checkErrors } from "../validators/checkErrors";

import { createGenreBreakdownService } from "../services/createGenreBreakdown";
import { getTopTenService } from "../services/getTopTen";
import { saveGenreBreakdownService } from "../services/saveGenreBreakdown";
import { getPublicUserTracksService } from "../services/getPublicUserTracks";
import { getUserDataFromDbService } from "../services/getUserDataFromDb";
import { getCurrentUserTracksService } from "../services/getCurrentUserTracks";

import { checkUserExistsInDb, getArrayFromMap, pushToHash } from "../lib/utils";

import profileSchema from "../models/profile.model";

export const getMyDetails = async (req, res, next) => {
    try {
        const Profile = mongoose.model(
            "Profile",
            profileSchema,
            req.session.userId
        );

        const response = await axios({
            method: "GET",
            url: "https://api.spotify.com/v1/me",
            headers: {
                Authorization: `Bearer ${req.session.access_token}`,
            },
            responseType: "json",
        });

        const newUser = {
            spotifyUserId: response.data.id,
            dateCreated: Date.now(),
            dateLastRetrievedData: Date.now(),
        };

        const profile = new Profile(newUser);

        profile.save();

        res.send(response.data);
    } catch (err) {
        console.log(err);

        return next({
            success: false,
            status: 500,
            message: "Uh oh, something went wrong on our side",
        });
    }
};

export const analyzeMyData = async (req, res, next) => {
    try {
        console.time();
        const currentUserTracks = await getCurrentUserTracksService(
            req.session.access_token
        );

        const currentUserGenreBreakdown = await createGenreBreakdownService(
            currentUserTracks
        );

        await saveGenreBreakdownService(
            currentUserGenreBreakdown,
            req.session.userId
        );

        console.timeEnd();
        res.json(getArrayFromMap(currentUserGenreBreakdown));
    } catch (err) {
        console.log(err);

        return next({
            success: false,
            status: 500,
            message: "Uh oh, something went wrong on our side",
        });
    }
};

export const analyzePublicUserData = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const publicUserTracks = await getPublicUserTracksService(
            req.session.access_token,
            userId
        );

        const publicUserGenreBreakdown = await createGenreBreakdownService(
            publicUserTracks
        );

        res.json(getArrayFromMap(publicUserGenreBreakdown));
    } catch (err) {
        console.log(err);

        return next({
            success: false,
            status: 500,
            message: "Uh oh, something went wrong on our side",
        });
    }
};

export const getMyAnalysis = async (req, res, next) => {
    try {
        const userId = req.session.userId;

        const currentUserGenreBreakdown = await getUserDataFromDbService(
            userId
        );

        const currentUserTopTenGenres = await getTopTenService(
            currentUserGenreBreakdown
        );

        res.json(currentUserTopTenGenres);
    } catch (err) {
        console.log(err);

        return next({
            success: false,
            status: 500,
            message: "Uh oh, something went wrong on our side",
        });
    }
};

export const compareDataToUser = [
    validateQueryString,
    checkErrors,
    async (req, res, next) => {
        try {
            if (req.query.userid === undefined) {
                return res.send("You must input a user's email");
            }

            const currentUserId = req.session.userId;
            const publicUserId = req.query.userid;

            let publicUserGenreBreakdown;

            if (await checkUserExistsInDb(publicUserId)) {
                publicUserGenreBreakdown =
                    getUserDataFromDbService(publicUserId);
            } else {
                const publicUserTracks = await getPublicUserTracksService(
                    req.session.access_token,
                    publicUserId
                );

                publicUserGenreBreakdown = await createGenreBreakdownService(
                    publicUserTracks
                );
            }

            let currentUserGenreBreakdown;

            if (await checkUserExistsInDb(currentUserId)) {
                currentUserGenreBreakdown = await getUserDataFromDbService(
                    currentUserId
                );
            } else {
                const currentUserTracks = await getCurrentUserTracksService(
                    req.session.access_token
                );

                currentUserGenreBreakdown = await createGenreBreakdownService(
                    currentUserTracks
                );

                await saveGenreBreakdownService(
                    currentUserGenreBreakdown,
                    req.session.userId
                );
            }

            const publicUserTopTenGenres = await getTopTenService(
                publicUserGenreBreakdown
            );
            const currentUserTopTenGenres = await getTopTenService(
                currentUserGenreBreakdown
            );

            res.status(200).send({
                publicUserTopTenGenres,
                currentUserTopTenGenres,
            });
        } catch (err) {
            console.log(err);

            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    },
];

export const getTop50Tracks = async (req, res, next) => {
    try {
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${req.session.access_token}`;
        axios.defaults.responseType = "json";

        // const response = await axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50&offset=0')
        const response = await axios.get(
            "https://api.spotify.com/v1/me/top/tracks?limit=50"
        );

        // Put top tracks into hashmap
        const topTracksMap = new Map();

        response.data.items.forEach((track) => {
            if (!topTracksMap.has(track.id)) {
                const newTrack = {
                    count: 1,
                    artists: track.artists,
                    duration: track.duration_ms,
                    href: track.href,
                    name: track.name,
                    popularity: track.popularity,
                    explicit: track.explicit,
                };

                topTracksMap.set(track.id, newTrack);
            } else {
                topTracksMap[track.id].occurrences += 1;
            }
        });

        // Create hashmap of top tracks primary artists
        const topTracksArtistsMap = new Map();

        for (const value of topTracksMap.values()) {
            const currentTrackArtist = value.artists[0];

            if (!topTracksArtistsMap.has(currentTrackArtist.id)) {
                const newArtist = currentTrackArtist;

                topTracksArtistsMap.set(currentTrackArtist.id, newArtist);
            } else {
                topTracksArtistsMap.get(currentTrackArtist.id).count += 1;
            }
        }

        // Get artist genres and append to artist map
        let arrayOfArtistIds = Array.from(topTracksArtistsMap.keys());

        const rangeOfArtistIdsString = arrayOfArtistIds.toString();

        const artistRepsonse = await axios.get(
            `https://api.spotify.com/v1/artists?ids=${rangeOfArtistIdsString}`
        );

        // Push artist genres to artist map
        artistRepsonse.data.artists.forEach((artist) => {
            topTracksArtistsMap.get(artist.id).genres = artist.genres;
        });

        // append genres from primary artist to track hashmap
        for (const trackData of topTracksMap.values()) {
            const primaryArtist = trackData.artists[0];

            if (topTracksArtistsMap.has(primaryArtist.id)) {
                trackData.genres = topTracksArtistsMap.get(
                    primaryArtist.id
                ).genres;
            }
        }

        // Create hashmap of genres
        const genreBreakdown = await createGenreBreakdownService(topTracksMap);

        const topTepGenresFromTopFifty = await getTopTenService(genreBreakdown);

        res.json(topTepGenresFromTopFifty);
    } catch (err) {
        console.log(err);

        return next({
            success: false,
            status: 500,
            message: "Uh oh, something went wrong on our side",
        });
    }
};
