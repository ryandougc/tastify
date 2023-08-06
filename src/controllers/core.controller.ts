import { Comparison } from "../models/Comparison"
import { Profile } from "../models/Profile"

import { checkErrors } from "../validators/checkErrors"
import {
    validateComparisonDetails,
    validateUsersSpotifyUsername
} from "../validators/validator"

export const getUserProfile = async (req, res, next) => {
    try {
        const spotifyUsername: string = res.locals.spotifyUsername

        const foundProfile: Profile = await Profile.getUserProfile(spotifyUsername)

        return res.status(200).json({
            success: true,
            message: "Profile has been successfully retrieved",
            data: foundProfile
        })
    } catch(error) {
        if(error.message === "This user could not be found in the database") {
            return next({
                success: false,
                status: 404,
                message: "This user could not be found",
            });
        }

        console.log(error)

        return next({
            success: false,
            status: 500,
            message: "Uh oh, something went wrong on our side",
        });
    }
}

export const deleteUserProfile = async (req, res, next) => {
    try {
        const spotifyUsername: string = res.locals.spotifyUsername

        const foundProfile: Profile = await Profile.getUserProfile(spotifyUsername)

        await foundProfile.delete()

        res.status(200).json({
            success: true,
            message: "Profile has been successfully deleted",
        })
    } catch (error) {
        if(error.message === "This user could not be found in the database") {
            return next({
                success: false,
                status: 404,
                message: "This user could not be found",
            });
        }

        console.log(error)

        return next({
            success: false,
            status: 500,
            message: "Uh oh, something went wrong on our side",
        });
    }
}

export const generateAnalysis = async (req, res, next) => {
    try {
        const spotifyUsername: string = res.locals.spotifyUsername

        const foundProfile: Profile = await Profile.getUserProfile(spotifyUsername)

        if(foundProfile.analysis.genres.length > 0) {
            res.status(200).json({
                success: true,
                message: "Profile has successfully been analyzed",
                data: foundProfile.analysis
            })
        }

        // Generate analysis for Current User
        // Should probably implement some long polling or short polling or something here
        await foundProfile.generateAnalysis()

        return res.status(200).json({
            success: true,
            message: "Profile has successfully been analyzed",
            data: foundProfile.analysis
        })
    } catch (error) {
        if(error.message === "This user could not be found in the database") {
            return next({
                success: false,
                status: 404,
                message: "This user could not be found",
            });
        }

        console.log(error)

        return next({
            success: false,
            status: 500,
            message: "Uh oh, something went wrong on our side",
        });
    }
}

export const getUsersTop50 = async (req, res, next) => {
    try {
        const spotifyUsername: string = res.locals.spotifyUsername

        const foundProfile: Profile = await Profile.getUserProfile(spotifyUsername)

        const top50 = await foundProfile.getTop50()

        res.status(200).json({
            success: true,
            message: "Top50 Songs and Artists successfully retrieved",
            data: top50
        })
    } catch (error) {
        if(error.message === "This user could not be found in the database") {
            return next({
                success: false,
                status: 404,
                message: "This user could not be found",
            });
        }

        console.log(error)

        return next({
            success: false,
            status: 500,
            message: "Uh oh, something went wrong on our side",
        });
    }
}

export const getUsersFriends = async (req, res, next) => {
    try {
        const spotifyUsername: string = res.locals.spotifyUsername

        const foundProfile: Profile = await Profile.getUserProfile(spotifyUsername)

        const usersComparisons: Array<Comparison> = await foundProfile.getUsersListOfComparisons()

        res.status(200).json({
            success: true,
            message: "List of user's comparisons have been successfully retrieved",
            data: usersComparisons
        })
    } catch (error) {
        if(error.message === "This user could not be found in the database") {
            return next({
                success: false,
                status: 404,
                message: "This user could not be found",
            });
        }

        console.log(error)

        return next({
            success: false,
            status: 500,
            message: "Uh oh, something went wrong on our side",
        });
    }
}

export const createComparison = [
    validateComparisonDetails,
    checkErrors,
    async (req, res, next) => {
        try {
            const user1SpotifyUsername: string = req.body.user1
            const user2SpotifyUsername: string = req.body.user2

            const newComparison: Comparison = new Comparison(user1SpotifyUsername, user2SpotifyUsername)

            await newComparison.save()

            res.status(201).json({
                success: true,
                message: "Comparison has been successfully created"
            })
        } catch (error) {
            if(error.message === "This user could not be found in the database") {
                return next({
                    success: false,
                    status: 404,
                    message: "This user could not be found",
                });
            }
    
            console.log(error)
    
            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
]

export const getComparison = [
    validateUsersSpotifyUsername,
    checkErrors,
    async (req, res, next) => {
        try {
            const spotifyUsername: string = res.locals.spotifyUsername
            const friendsSpotifyUsername: string = req.query.spotifyUsername

            // Check comparison with both users exists
            const foundComparison: Comparison = await Comparison.get(spotifyUsername, friendsSpotifyUsername)

            res.status(200).json({
                success: true,
                message: "Comparison has successfully been retrieved",
                data: foundComparison
            })
        } catch (error) {
            if(error.message === "This user could not be found in the database") {
                return next({
                    success: false,
                    status: 404,
                    message: "This user could not be found",
                });
            }
    
            console.log(error)
    
            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
]

export const deleteComparison = [
    validateUsersSpotifyUsername,
    checkErrors,
    async (req, res, next) => {
        try {
            const spotifyUsername: string = res.locals.spotifyUsername
            const friendsSpotifyUsername: string = req.query.spotifyUsername

            const foundComparison: Comparison = await Comparison.get(spotifyUsername, friendsSpotifyUsername)

            await foundComparison.delete()

            res.status(200).json({
                success: true,
                message: "Comparison has successfully been deleted"
            })
        } catch (error) {
            if(error.message === "This user could not be found in the database") {
                return next({
                    success: false,
                    status: 404,
                    message: "This user could not be found",
                });
            }
    
            console.log(error)
    
            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
]