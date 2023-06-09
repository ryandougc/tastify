import mongoose from 'mongoose';

import { Profile } from '../models/Profile'
import { Comparison } from '../models/Comparison'
import { Analysis } from "../models/Analysis";

// Create the schema for Profile and Comparison
const profileSchema = new mongoose.Schema<Profile>({
    profileId: {
        type: String,
        index: true,
        unique: true
    },
    spotifyUsername: {
        type: String,
        unique: true
    },
    dateCreated: Date,
    analysis: {
        genres: Array
    }
});

const comparisonSchema = new mongoose.Schema<Comparison>({
    user1: String,
    user2: String,
    dateCreated: Date
})
comparisonSchema.index({ user1: 1, user2: 1}, { unique: true});

export const MongoProfile = mongoose.model<Profile>('Profile', profileSchema)
export const MongoComparison = mongoose.model<Comparison>('Comparison', comparisonSchema)
 
// Add all the functions to act on the schema
export const createUserProfile = async (userProfile: Profile): Promise<boolean> => {
    try {
        await MongoProfile.create({ 
            profileId: userProfile.profileId,  
            spotifyUsername: userProfile.spotifyUsername,
            dateCreated: userProfile.dateCreated,
            analysis: userProfile.analysis
        })

        return true
    } catch(error) {
        console.log(error)
        throw new Error("Error while inserting a document into the database")
    }
}
 
export const getUserProfile = async (profileId: string): Promise<Profile> => {
    try {
        const profileData = await MongoProfile.findOne({ profileId: profileId })
            .select('-_id profileId spotifyUsername dateCreated analysis').exec()

        const profile = new Profile(
            profileData.spotifyUsername,
            profileData.profileId,
            profileData.dateCreated,
            new Analysis(profileData.analysis.genres)
        )

        return profile
    } catch(error) {
        console.log(error)
        throw new Error("Error while querying the database for a profile")
    }
}

export const checkUserProfileExists = async (profileId: string): Promise<boolean> => {
    try {
        await MongoProfile.exists({ profileId: profileId }).exec()

        return true
    } catch(error) {
        console.log(error)
        throw new Error('Error while querying database for an existing profile')
    }
}

export const updateUserProfile = async (userProfile: Profile): Promise<boolean> => {
    try {
        await MongoProfile.updateOne({ profileId: userProfile.profileId }, userProfile)

        return true
    } catch(error) {
        console.log(error)
        throw new Error('Error while updating a profile in the database')
    }
}

export const deleteUserProfile = async (profileId: string): Promise<boolean> => {
    try {
        const deletedProfile = await MongoProfile.deleteOne({ profileId: profileId })

        console.log(deletedProfile.deletedCount)

        if(deletedProfile.deletedCount <= 0) throw Error("Invalid profile ID")

        return true
    } catch(error) {
        console.log(error)
        throw new Error('Error while deleting a profile from the database')
    }
}

export const createComparison = async (comparison: Comparison): Promise<boolean> => {
    try {
        const result = await MongoComparison.create({ 
            user1: comparison.user1,
            user2: comparison.user2,
            dateCreated: comparison.dateCreated
        })

        return true
    } catch(error) {
        console.log(error)
        throw new Error('Error while creating a comparison in the database')
    }
}

export const getComparison = async (user1: string, user2: string): Promise<Comparison> => {
    try {
        const foundComparison = await MongoComparison.findOne({ user1: user1, user2: user2})

        const comparison = new Comparison(
            foundComparison.user1,
            foundComparison.user2,
            foundComparison.dateCreated
        )

        return comparison
    } catch(error) {
        console.log(error)
        throw new Error('Error while fetching a comparison from the database')
    }
}

export const deleteComparison = async (user1: string, user2: string): Promise<boolean> => {
    try {
        const result = await MongoComparison.deleteOne({ user1: user1, user2: user2 })

        if(result.deletedCount <= 0) throw new Error('Error while deleting a comparison from the database')

        return true
    } catch(error) {
        console.log(error)
        throw new Error('Error while deleting a comparison from the database')
    }
}

export const getUsersComparisons = async (profileId: string): Promise<Array<Comparison>> => {
    try {
        const foundComparisons = await MongoComparison.find({ $or: [{user1: profileId}, {user2: profileId}] }).exec()

        let comparisons = []

        foundComparisons.forEach(comparison => {
            const newComparison = new Comparison(
                comparison.user1,
                comparison.user2,
                comparison.dateCreated
            )

            comparisons.push(newComparison)
        })

        return comparisons
    } catch(error) {
        console.log(error)
        throw new Error('Error while fetching a list of a user\'s comparisons')
    }
}

export const deleteAllUsersComparisons = async (profileId: string): Promise<boolean> => {
    try {
        const result = await MongoComparison.deleteMany({ $or: [{user1: profileId}, {user2: profileId}] }).exec()

        if(result.deletedCount <= 0) throw new Error('Error while deleting a comparison from the database')

        return true
    } catch(error) {
        console.log(error)
        throw new Error("Error while deleting all of a user's comparisons")
    }
}

// Using this for the apiEndpoint.test.ts file so we don't need a profileId to find a user
export const getUserProfileBySpotifyUsername = async (spotifyUsername: string): Promise<Profile> => {
    try {
        const profileData = await MongoProfile.findOne({ spotifyUsername: spotifyUsername })
            .select('-_id profileId spotifyUsername dateCreated analysis').exec()

        const profile = new Profile(
            profileData.spotifyUsername,
            profileData.profileId,
            profileData.dateCreated,
            new Analysis(profileData.analysis.genres)
        )

        return profile
    } catch(error) {
        console.log(error)
        throw new Error("Error while querying the database for a profile")
    }
}