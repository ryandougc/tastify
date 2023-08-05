/*
* @group integration
* @group database
*/

import mongoose, { ConnectOptions } from 'mongoose'

import { 
    MongoProfile, 
    MongoComparison,
    deleteAllUsersComparisons 
} from '../connect-mongo'

import { Analysis } from '../../models/Analysis'
import { Artist } from '../../models/Artist'
import { Comparison } from '../../models/Comparison'
import { Genre } from '../../models/Genre'
import { Profile } from '../../models/Profile'
import { Track } from '../../models/Track'

import {
    createComparison,
    createUserProfile,
    deleteComparison,
    deleteUserProfile,
    getComparison,
    getUserProfile,
    updateUserProfile,
    getUsersComparisons,
    getUserProfileBySpotifyUsername
} from '../dbDriver'

describe('Database Driver', () => {
    beforeAll(async () => {
        // Connect to the MongoDB database
        try {
            await mongoose.connect('mongodb+srv://ryan:Sportking11!@cluster0.v1mw48k.mongodb.net/?retryWrites=true', {
                dbName: 'testing',
                useNewUrlParser: true,
                useUnifiedTopology: true
            } as ConnectOptions);
        } catch (error) {
            console.log('Database Connection Error')
        }
    })

    afterEach(async () => {
        // Remove the test document from the database after the tests
        await MongoProfile.deleteMany({})
        await MongoComparison.deleteMany({})
    })

    afterAll(async () => {
        // Disconnect from the MongoDB database
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    })

    describe('createUserProfile()', () => {
        it('should return true after saving the valid user profile provided in the database', async () => {
            const newProfile = new Profile('test-name')

            const result = await createUserProfile(newProfile)

            expect(result).toBe(true)
        })
        it('should be able to fetch the newly created user form the database', async () => {
            const newProfile = new Profile('test-name')

            await createUserProfile(newProfile)

            const foundUser = await getUserProfileBySpotifyUsername(newProfile.spotifyUsername)

            expect(foundUser.spotifyUsername).toBe('test-name')
        })
        it('should throw an error if we try creating a profile with a spotifyUsername that already exists', async () => {
            const newProfile1 = new Profile('test-name-1')
            const newProfile2 = new Profile('test-name-1')

            await createUserProfile(newProfile1)

            const result = async () => {
                return await createUserProfile(newProfile2)
            }

            expect(result()).rejects.toThrow()
        })
    })
    describe('getUserProfile()', () => {
        let globaldummyProfile

        beforeEach(async () => {
            const dummyProfile = new Profile('dummy-name')
            globaldummyProfile = dummyProfile

            await createUserProfile(dummyProfile)
        })
        it('should return the fetched user profile', async () => {
            const foundUser: Profile = await getUserProfileBySpotifyUsername(globaldummyProfile.spotifyUsername)

            expect(foundUser.spotifyUsername).toBe('dummy-name')
        })
    })
    describe('updateUserProfile()', () => {
        let globaldummyProfile

        const testGenre = new Genre(
            'dummy-genre',
            1,
            [ new Track(
                    [ new Artist(
                        [],
                        "test-artist-href",
                        "test-artist-id",
                        "test-artist-name"
                    )],
                    "https//dummy.com",
                    "193",
                    "dummy-track",
                    "track"
            )],
            [ new Artist(
                    ['test-genre'],
                    "https://test-href",
                    "194",
                    "test-artist",
                    0.94
            )]
        )

        const testGenresAnalysis = [testGenre]

        const newAnalysis = new Analysis(testGenresAnalysis)

        beforeEach(async () => {
            const dummyProfile = new Profile('dummy-name')
            globaldummyProfile = dummyProfile

            await createUserProfile(dummyProfile)
        })
        it('should update the profile database entry and return true', async () => {
            const updatedProfile = globaldummyProfile 

            updatedProfile.analysis = newAnalysis

            const result = await updateUserProfile(updatedProfile)

            expect(result).toBe(true)
        })
        
        it('should update the profile database entry and check the new data is present', async () => {
            const updatedProfile: Profile = globaldummyProfile 

            const foundProfileBeforeUpdate: Profile = await getUserProfileBySpotifyUsername(updatedProfile.spotifyUsername)

            updatedProfile.analysis = newAnalysis

            await updateUserProfile(updatedProfile)

            const foundUpdatedProfile: Profile = await getUserProfileBySpotifyUsername(updatedProfile.spotifyUsername)

            expect(foundUpdatedProfile.analysis.genres[0].name).toEqual('dummy-genre')
        })
    })
    describe('deleteUserProfile()', () => {
        let globaldummyProfile

        beforeEach(async () => {
            const dummyProfile = new Profile('dummy-name')
            globaldummyProfile = dummyProfile

            await createUserProfile(dummyProfile)
        })
        it('should return true if the profile is deleted', async () => {
            const result = await deleteUserProfile(globaldummyProfile.spotifyUsername)

            expect(result).toBe(true)
        })  
    })
    describe('createComparison()', () => {
        let globalDummyProfile1
        let globalDummyProfile2

        beforeEach(async () => {
            const dummyProfile1 = new Profile('dummy-profile-1')
            const dummyProfile2 = new Profile('dummy-profile-2')

            globalDummyProfile1 = dummyProfile1
            globalDummyProfile2 = dummyProfile2
        })
        it('should return true if the comparison is added to the database', async () => {
            const newComparison = new Comparison(globalDummyProfile1.profileId, globalDummyProfile2.profileId)

            const result = await createComparison(newComparison)

            expect(result).toBe(true)
        })
        it('should throw an error if we try adding a comparison that already exists', async () => {
            const newComparison = new Comparison(globalDummyProfile1.profileId, globalDummyProfile2.profileId)

            await createComparison(newComparison)

            const result = async () => {
                await createComparison(newComparison)
            }

            expect(result).rejects.toThrow()
        })
    })
    describe('deleteComparison()', () => {
        let globalDummyComparison

        beforeEach(async () => {
            const dummyProfile1 = new Profile('dummy-profile-1')
            const dummyProfile2 = new Profile('dummy-profile-2')

            const dummyComparison = new Comparison(dummyProfile1.profileId, dummyProfile2.profileId)

            globalDummyComparison = dummyComparison
        })
        it('should return true if the comparison is deleted from the database', async () => {
            await createComparison(globalDummyComparison)

            const result = await deleteComparison(globalDummyComparison.user1, globalDummyComparison.user2)

            expect(result).toBe(true)
        })
        it("should throw if we try to delete a comparison that doesn't exist", () => {
            const result = async () => {
                await deleteComparison(globalDummyComparison.user1, globalDummyComparison.user2)
            }

            expect(result).rejects.toThrow()
        })
    })
    describe('getComparison()', () => {
        let globalDummyComparison

        beforeEach(async () => {
            const dummyProfile1 = new Profile('dummy-profile-1')
            const dummyProfile2 = new Profile('dummy-profile-2')

            const dummyComparison = new Comparison(dummyProfile1.profileId, dummyProfile2.profileId)

            globalDummyComparison = dummyComparison

            await createComparison(dummyComparison)
        })
        it('should return the comparison object instance with the corresponding users', async () => {
            const foundComparison: Comparison = await getComparison(globalDummyComparison.user1, globalDummyComparison.user2)

            expect(foundComparison.user1).toEqual(globalDummyComparison.user1)
            expect(foundComparison.user2).toEqual(globalDummyComparison.user2)
        })
    })
    describe('getUsersComparisons()', () => {
        let globalDummyUser2
        let globalDummyComparison1

        beforeEach(async () => {
            try {
                const dummyUser1 = new Profile('User1')
                const dummyUser2 = new Profile('User2')
                const dummyUser3 = new Profile('User3')

                globalDummyUser2 = dummyUser2

                const dummyComparison1 = new Comparison(
                    dummyUser1.profileId,
                    dummyUser2.profileId
                )

                const dummyComparison2 = new Comparison(
                    dummyUser3.profileId,
                    dummyUser2.profileId
                )

                globalDummyComparison1 = dummyComparison1

                await MongoComparison.create({
                    user1: dummyComparison1.user1,
                    user2: dummyComparison1.user2,
                    dateCreated: dummyComparison1.dateCreated
                })

                await MongoComparison.create({
                    user1: dummyComparison2.user1,
                    user2: dummyComparison2.user2,
                    dateCreated: dummyComparison1.dateCreated
                })
            } catch (error) {
                throw new Error('Error seeding database')
            }
        })
        it("should return an array of 2 Comparison object instances", async () => {
            const profileToGetComparisonsFor: Profile = globalDummyUser2

            const foundComparisons = await getUsersComparisons(profileToGetComparisonsFor)

            expect(foundComparisons.length).toBe(2)
            expect(foundComparisons[0]).toBeInstanceOf(Comparison)
            expect(foundComparisons[1]).toBeInstanceOf(Comparison)
        })
        it('should return a an array that contains a Comparison matching the expect comparison object instance', async () => {
            const profileToGetComparisonsFor: Profile = globalDummyUser2
            const expectedComparisonResponse: Comparison = globalDummyComparison1

            const foundComparisons: Array<Comparison> = await getUsersComparisons(profileToGetComparisonsFor)

            expect(foundComparisons).toEqual(expect.arrayContaining([expectedComparisonResponse]))
        })
        it('should return an empty array if no comparisons are found for the specified userId', async () => {
            const fakeProfileToGetComparisonFor: Profile = new Profile('fake-profile')

            const foundComparisons = await getUsersComparisons(fakeProfileToGetComparisonFor)

            expect(foundComparisons).toEqual([])
        })
    })
    describe('deleteAllUsersComparisons()', () => {
        let globalDummyUser1

        beforeEach(async () => {
            try {
                const dummyUser1 = new Profile('User1')
                const dummyUser2 = new Profile('User2')
                const dummyUser3 = new Profile('User3')

                globalDummyUser1 = dummyUser1

                const dummyComparison1 = new Comparison(
                    dummyUser1.profileId,
                    dummyUser2.profileId
                )

                const dummyComparison2 = new Comparison(
                    dummyUser1.profileId,
                    dummyUser3.profileId
                )

                const dummyComparison3 = new Comparison(
                    dummyUser2.profileId,
                    dummyUser3.profileId
                )

                await MongoComparison.create({
                    user1: dummyComparison1.user1,
                    user2: dummyComparison1.user2,
                    dateCreated: dummyComparison1.dateCreated
                })

                await MongoComparison.create({
                    user1: dummyComparison2.user1,
                    user2: dummyComparison2.user2,
                    dateCreated: dummyComparison1.dateCreated
                })


                await MongoComparison.create({
                    user1: dummyComparison3.user1,
                    user2: dummyComparison3.user2,
                    dateCreated: dummyComparison1.dateCreated
                })
            } catch (error) {
                throw new Error('Error seeding database')
            }
        })
        it('should return true if the comparisons are deleted successfully', async () => {
            const profileIdToDeleteComparisonsFrom: string = globalDummyUser1.profileId

            const result: boolean = await deleteAllUsersComparisons(profileIdToDeleteComparisonsFrom)

            expect(result).toBe(true)
        })
        it('should not throw if a valid profileId is provided', async () => {
            const profileIdToDeleteComparisonsFrom: string = globalDummyUser1.profileId

            const result: boolean = await deleteAllUsersComparisons(profileIdToDeleteComparisonsFrom)

            expect(result).toBe(true)
        })
        it('should throw an error if we look for comparisons for a user whos comparisons were all deleted', async () => {
            const profileIdToDeleteComparisonsFrom: string = globalDummyUser1.profileId

            await deleteAllUsersComparisons(profileIdToDeleteComparisonsFrom)

            const foundComparisons: Array<Comparison> = await MongoComparison.find({ $or: [{user1: profileIdToDeleteComparisonsFrom}, {user2: profileIdToDeleteComparisonsFrom}] }).exec()

            expect(foundComparisons).toEqual([])
        })
        it('should throw if an invalid profileId is provided', async () => {
            const fakeProfileIdToDeleteComparisonsFrom: string = '11112222'

            const result = async () => {
                await deleteAllUsersComparisons(fakeProfileIdToDeleteComparisonsFrom)
            }

            expect(result).rejects.toThrow()
        })
    })
})