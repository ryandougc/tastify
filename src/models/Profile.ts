import { generateUserId } from '../lib/utils';

import { Top50 } from '../lib/types'

import { Analysis } from './Analysis'
import { Comparison } from './Comparison';
import { Track } from './Track';
import { Artist } from './Artist';

import {
    createUserProfile,
    getUserProfile, 
    checkUserProfileExists, 
    updateUserProfile,
    deleteUserProfile,
    getUsersComparisons,
    deleteAllUsersComparisons
  } from '../lib/dbDriver'
import { getTop50Service } from '../services/getTop50';

export interface Profile {
    profileId: string;
    spotifyUsername: string;
    dateCreated: Date;
    analysis: Analysis
}
    

export class Profile implements Profile {
    constructor(spotifyUsername: string, profileId?: string, dateCreated?: Date, analysis?: Analysis) {
        this.spotifyUsername = spotifyUsername
        this.profileId = profileId || this.generateUserId()
        this.dateCreated = dateCreated || new Date()
        this.analysis = analysis || new Analysis()
    }

    generateUserId(): string {
        try {
            return generateUserId()
        } catch(error) {
            throw new Error(`Error generating profileId: ${error}`)
        }
    }

    async save(): Promise<void> {
        try {
            const userExists = await checkUserProfileExists(this.profileId)

            if(userExists) await updateUserProfile(this)
            else await createUserProfile(this)
        } catch(error) {
            throw new Error(`Error saving profile: ${error}`)
        }
    }

    async delete(): Promise<void> {
        try {
            // Delete all comparisons associated with the user
            await deleteAllUsersComparisons(this)

            await deleteUserProfile(this)
        } catch(error) {
            throw new Error(`Error saving profile: ${error}`)
        }
    }

    async generateAnalysis(): Promise<void> {
        try {
            const newAnalysis: Analysis = await this.analysis.generateAnalysis(this.profileId)

            this.analysis = newAnalysis
        } catch(error) {
            throw new Error('Error generating analysis')
        }
    }

    async getTop50(): Promise<Top50> {
        try {
            const top50: Top50 = await getTop50Service()
  
            return top50
        } catch(error) {
            throw new Error('Error fetching top50')
        }
    }

    async getUsersListOfComparisons(): Promise<Array<Comparison>> {
        try {
            const comparisons: Array<Comparison> = await getUsersComparisons(this)

            return comparisons
        } catch(error) {
            throw new Error('Error fetching users comparisons')

        }
    }
    
    static async getUserProfile(profileId: string): Promise<Profile> {
        try {
            const profile: Profile = await getUserProfile(profileId)

            if(profile === null) throw new Error('Error fetching profile')

            return profile
        } catch(error) {
            throw new Error('Error fetching profile')
        }
    }
}