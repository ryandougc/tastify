import * as db from '../lib/connect-mongo'

import { Profile } from '../models/Profile'
import { Comparison } from '../models/Comparison'

export const createUserProfile = async (userProfile: Profile): Promise<boolean> => {
    try {
        const result: boolean = await db.createUserProfile(userProfile)

        return result
    } catch(error) {
        throw new Error(`Error when creating user in the database`)
    }
}

export const getUserProfile = async (profileId: string): Promise<Profile> => {
    try {
        const profile: Profile = await db.getUserProfileBySpotifyUsername(profileId)

        return profile
    } catch(error) {
        throw new Error(`Error when fetching user from the database`)
    }
}

export const checkUserProfileExists = async (spotifyUsername: string): Promise<boolean> => {
    try {
        const result: boolean = await db.checkUserProfileExists(spotifyUsername)

        return result
    } catch(error) {
        throw new Error(`Error when checking if a profile exists`)
    }
}

export const updateUserProfile = async (userProfile: Profile): Promise<boolean> => {
    try {
        const result: boolean = await db.updateUserProfile(userProfile)

        return result
    } catch(error) {
        throw new Error(`Error when updating a profile`)
    }
}

export const deleteUserProfile = async (spotifyUsername: string): Promise<boolean> => {
    try {
        const result: boolean = await db.deleteUserProfile(spotifyUsername)

        return result
    } catch(error) {
        throw new Error(error.message)
    }
}

export const createComparison = async (comparison: Comparison): Promise<boolean> => {
    try {
        const result: boolean = await db.createComparison(comparison)

        return result
    } catch(error) {
        throw new Error(`Error when creating a comparison`)
    }
}

export const deleteComparison = async (user1: string, user2: string): Promise<boolean> => {
    try {
        const result: boolean = await db.deleteComparison(user1, user2)

        return result
    } catch(error) {
        throw new Error(`Error when deleting a comparison`)
    }
}

export const getComparison = async (user1: string, user2: string): Promise<Comparison> => {
    try {
        const result: Comparison = await db.getComparison(user1, user2)

        return result
    } catch(error) {
        throw new Error(`Error when fetching a comparison`)
    }
}

export const getUsersComparisons = async (profile: Profile): Promise<Array<Comparison>> => {
    try {
        const userComparisons: Array<Comparison> = await db.getUsersComparisons(profile.profileId)

        return userComparisons
    } catch(error) {
        throw new Error(`Error when fetching a user's comparisons`)

    }
}

export const deleteAllUsersComparisons = async (spotifyusername: string): Promise<boolean> => {
    try {
        const result: boolean = await db.deleteAllUsersComparisons(spotifyusername)

        return true
    } catch(error) {
        throw new Error("Error when deleting all a user's comparisons")
    }
}

// Using this for the apiEndpoint.test.ts file so we don't need a profileId to find a user
export const getUserProfileBySpotifyUsername = async (spotifyUsername: string): Promise<Profile> => {
    try {
        const profile: Profile = await db.getUserProfileBySpotifyUsername(spotifyUsername)

        return profile
    } catch(error) {
        throw new Error(error.message)
    }
}