import { checkErrors } from "../validators/checkErrors";
import {
    validateUserDetails,
    validateUserIdParameter,
    validateComparisonDetails,
    validateTwoUserIdParameters
} from "../validators/validator";
import { Profile } from "../models/Profile";
import { Analysis } from "../models/Analysis";
import { Comparison } from "../models/Comparison";

export const createProfile = [
    validateUserDetails,
    checkErrors,
    async (req, res, next) => {
        try {
            // Create Profile object
            const newProfile = new Profile(
                req.body.spotifyUsername
            )

            console.log(newProfile)

            // Save Profile to database
            await newProfile.save()

            // Return Success Confirmation
            return res.status(201).json({
                success: true,
                status: 201,
                message: "Profile has been successfully created"
            })
        } catch (error) {
            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
]

export const getUserProfile = [
    validateUserIdParameter,
    checkErrors,
    async (req, res, next) => {
        try {
            // Retrieve Profile from DB
            const foundProfile = await Profile.getUserProfile(req.body.profileId)

            // Return result from DB
            return res.status(201).json({
                success: true,
                status: 200,
                message: "Profile has been successfully retrieved",
                data: foundProfile
            })
        } catch (error) {
            console.log(error);

            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
]

export const updateUserProfile = [
    validateUserDetails,
    checkErrors,
    async (req, res, next) => {
        try {
            const profileId: string = req.body.profileId
            // Get the data for Profile properties that were changed

            // Fetch Profile from database to ensure it already exists
            const foundProfile: Profile = await Profile.getUserProfile(profileId)

            // Update profile here

            // Save Profile to database
            await foundProfile.save()

            // Return Success Confirmation
            res.status(200).json({
                success: true,
                status: 200,
                message: "Profile has been successfully updated",
            })
        } catch (error) {
            console.log(error);

            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
]

export const deleteUserProfile = [
    validateUserIdParameter,
    checkErrors,
    async (req, res, next) => {
        try {
            const profileId: string = req.body.profileId

            // Fetch user profile to check if the user exists
            const foundProfile = await Profile.getUserProfile(profileId)

            // Delete user in Database
            await foundProfile.delete()

            // Return Success Confirmation
            res.status(200).json({
                success: true,
                status: 200,
                message: "Profile has been successfully deleted",
            })
        } catch (error) {
            console.log(error);

            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
]

export const generateAnalysis = [
    validateUserIdParameter,
    checkErrors,
    async (req, res, next) => {
        try {
            const profileId: string = req.body.profileId

            // Get user profile to make sure they exist
            const foundProfile: Profile = await Profile.getUserProfile(profileId)

            // Generate analysis for Current User
            // Should probably implement some long polling or short polling or something here
            await foundProfile.generateAnalysis()

            // Save analysis the user's profile
            await foundProfile.save()

            // Return Success Confirmation
            res.status(200).json({
                success: true,
                status: 200,
                message: "Profile has successfully been analyzed",
                data: foundProfile
            })
        } catch (error) {
            console.log(error);

            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
]

export const getUsersTop50 = [
    validateUserIdParameter,
    checkErrors,
    async (req, res, next) => {
        try {
            const profileId: string = req.body.profileId

            // Fetch profile to ensure it exists
            const foundProfile: Profile = await Profile.getUserProfile(profileId)

            // Pull top50 from Spotify API
            const top50 = await foundProfile.getTop50()

            // Return result from DB
            res.status(200).json({
                success: true,
                status: 200,
                message: "Top50 Songs and Artists successfully retrieved",
                data: top50
            })
        } catch (error) {
            console.log(error);

            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
]

export const getUsersFriends = [
    validateUserIdParameter,
    checkErrors,
    async (req, res, next) => {
        try {
            const profileId: string = req.body.profileId

            // Check if user exists and retrieve their profile
            const foundProfile: Profile = await Profile.getUserProfile(profileId)

            // Search database for comparisons that involve the users Id
            const usersComparisons: Array<Comparison> = await foundProfile.getUsersListOfComparisons()

            // Return array of comparison objects
            res.status(200).json({
                success: true,
                status: 200,
                message: "List of user's comparisons have been successfully retrieved",
                data: usersComparisons
            })
        } catch (error) {
            console.log(error);

            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
]

export const createComparison = [
    validateComparisonDetails,
    checkErrors,
    async (req, res, next) => {
        try {
            const user1ProfileId: string = req.body.user1
            const user2ProfileId: string = req.body.user2

            // Create comparison object
            const newComparison: Comparison = new Comparison(user1ProfileId, user2ProfileId)

            // Save comparison to database
            await newComparison.save()

            // Return Success Confirmation
            res.status(201).json({
                success: true,
                status: 201,
                message: "Comparison has been successfully created"
            })
        } catch (error) {
            console.log(error);

            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
]

export const getComparison = [
    validateTwoUserIdParameters,
    checkErrors,
    async (req, res, next) => {
        try {
            const user1ProfileId: string = req.body.user1
            const user2ProfileId: string = req.body.user2

            // Check comparison with both users exists
            const foundComparison: Comparison = await Comparison.get(user1ProfileId, user2ProfileId)

            // Return Comparison
            res.status(200).json({
                success: true,
                status: 201,
                message: "Comparison has successfully been retrieved",
                data: foundComparison
            })
        } catch (error) {
            console.log(error);

            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
]

export const deleteComparison = [
    validateTwoUserIdParameters,
    checkErrors,
    async (req, res, next) => {
        try {
            const user1ProfileId: string = req.body.user1
            const user2ProfileId: string = req.body.user2

            // Check comparison exists
            const foundComparison: Comparison = await Comparison.get(user1ProfileId, user2ProfileId)

            // Delete comparison in DB
            await foundComparison.delete()

            // Return success Confirmation
            res.status(200).json({
                success: true,
                status: 200,
                message: "Comparison has successfully been deleted"
            })
        } catch (error) {
            console.log(error);

            return next({
                success: false,
                status: 500,
                message: "Uh oh, something went wrong on our side",
            });
        }
    }
]