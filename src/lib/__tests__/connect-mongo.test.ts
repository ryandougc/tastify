/*
* @group integration
* @group database
*/

import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

import { Profile } from "../../models/Profile"
import { Comparison } from "../../models/Comparison"

import {
    createUserProfile,
    getUserProfile,
    checkUserProfileExists,
    updateUserProfile,
    deleteUserProfile,
    createComparison,
    getComparison,
    deleteComparison,
    getUsersComparisons,
    MongoComparison,
    MongoProfile,
    deleteAllUsersComparisons,
} from '../connect-mongo'

describe('Mongo Database Functions', () => {
    let mongoServer: MongoMemoryServer

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        await mongoose.connect(mongoServer.getUri(), { dbName: "testing" })
    })

    afterEach(async () => {
        // Remove the test document from the database after the tests
        await MongoProfile.deleteMany({})
        await MongoComparison.deleteMany({})
    })

    afterAll(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect()
        }
        if (mongoServer) {
            await mongoServer.stop()
        }
    })

    describe('createUserProfile()', () => {
        it('should not throw if a valid Profile is provided and the database is connected', async () => {
            const newUser = new Profile('username')

            const result = async () => {
                await createUserProfile(newUser)
            }

            expect(result).not.toThrow()
        })
        it('should add the user to the database and be retrieved when fetching', async () => {
            const newUser = new Profile('username2')

            await createUserProfile(newUser)

            const user: Profile = await MongoProfile.findOne({ profileId: newUser.profileId })

            expect(user.spotifyUsername).toBe('username2')
        })
        it('should throw an error if we add a profile with a spotifyUsername that already exists', async () => {
            const newProfile1 = new Profile('test-name-1')
            const newProfile2 = new Profile('test-name-1')

            await createUserProfile(newProfile1)

            const result = async () => {
                await createUserProfile(newProfile2)
            }

            expect(result).rejects.toThrow()
        })
    })
    describe('getUserProfile()', () => {
        let globalDummyProfile

        beforeEach(async () => {
            try {
                const dummyProfile = new Profile('dummy')

                await MongoProfile.create({
                    profileId: dummyProfile.profileId,
                    spotifyUsername: dummyProfile.spotifyUsername,
                    dateCreated: dummyProfile.dateCreated,
                    analysis: dummyProfile.analysis
                })

                globalDummyProfile = dummyProfile
            } catch (error) {
                throw new Error('Error seeding database')
            }
        })
        it('should fetch the seeded user with the dummyProfileId', async () => {
            const dummyProfileId = globalDummyProfile.profileId

            const foundUser: Profile = await getUserProfile(dummyProfileId)

            expect(foundUser.spotifyUsername).toEqual(globalDummyProfile.spotifyUsername)
        })
    })
    describe('checkUserProfileExists()', () => {
        let globalDummyProfile

        beforeEach(async () => {
            try {
                const dummyProfile = new Profile('dummy')

                await MongoProfile.create({
                    profileId: dummyProfile.profileId,
                    spotifyUsername: dummyProfile.spotifyUsername,
                    dateCreated: dummyProfile.dateCreated,
                    analysis: dummyProfile.analysis
                })

                globalDummyProfile = dummyProfile
            } catch (error) {
                throw new Error('Error seeding database')
            }
        })
        it('should return true if a profile is found with the corresponding profileId', async () => {
            const spotifyUsernameToCheckForExistingProfile = globalDummyProfile.spotifyUsername

            const profileExists: boolean = await checkUserProfileExists(spotifyUsernameToCheckForExistingProfile)

            expect(profileExists).toBe(true)
        })
        it('should return false if a profile is not found with the profileId', async () => {
            const profileIdToCheck = 'fakeProfileId'

            const profileExists: boolean = await checkUserProfileExists(profileIdToCheck)

            expect(profileExists).toBe(false)
        })
    })
    describe('updateUserProfile', () => {
        let globalDummyProfile

        beforeEach(async () => {
            try {
                const dummyProfile = new Profile('dummy')

                await MongoProfile.create({
                    profileId: dummyProfile.profileId,
                    spotifyUsername: dummyProfile.spotifyUsername,
                    dateCreated: dummyProfile.dateCreated,
                    analysis: dummyProfile.analysis
                })

                globalDummyProfile = dummyProfile
            } catch (error) {
                throw new Error('Error seeding database')
            }
        })
        it('should return true if a valid profile is updated', async () => {
            const updatedDummyUser = globalDummyProfile
            updatedDummyUser.spotifyUsername = 'updated'

            const result: boolean = await updateUserProfile(updatedDummyUser)

            expect(result).toBe(true)
        })
        it('should update the profile in the database to match the updated profile', async () => {
            const updatedDummyUser = globalDummyProfile
            updatedDummyUser.spotifyUsername = 'updated'

            await updateUserProfile(updatedDummyUser)

            const foundUpdatedUser = await MongoProfile.findOne({ profileId: updatedDummyUser.profileId })

            expect(foundUpdatedUser.spotifyUsername).toEqual(updatedDummyUser.spotifyUsername)
        })
    })
    describe('deleteUserProfile()', () => {
        let globalDummyProfile

        beforeEach(async () => {
            try {
                const dummyProfile = new Profile('dummy')

                await MongoProfile.create({
                    profileId: dummyProfile.profileId,
                    spotifyUsername: dummyProfile.spotifyUsername,
                    dateCreated: dummyProfile.dateCreated,
                    analysis: dummyProfile.analysis
                })

                globalDummyProfile = dummyProfile
            } catch (error) {
                throw new Error('Error seeding database')
            }
        })
        it('should return true if the profile was deleted and nolonger exists in the database', async () => {
            const spotifyUsername: string = globalDummyProfile.spotifyUsername

            const result = await deleteUserProfile(spotifyUsername)

            const foundProfile: boolean = await checkUserProfileExists(spotifyUsername)

            expect(result).toBe(true)
            expect(foundProfile).toBe(false)
        })
        it("should throw an error if the specified user to delete doesn\'t exist in the database", () => {
            const fakeSpotifyUsername: string = "Tastify"

            const result = async () => {
                await deleteUserProfile(fakeSpotifyUsername)
            }

            expect(result).rejects.toThrow("This user could not be found in the database")
        })
    })
    describe('createComparison()', () => {
        let globalDummyUser1
        let globalDummyUser2

        beforeEach(async () => {
            try {
                const dummyUser1 = new Profile('User1')
                const dummyUser2 = new Profile('User2')

                globalDummyUser1 = dummyUser1
                globalDummyUser2 = dummyUser2
            } catch (error) {
                throw new Error('Error seeding database')
            }
        })
        it('should return true when a comparison is created', async () => {
            const dummyComparison: Comparison = new Comparison(globalDummyUser1.profileId, globalDummyUser2.profileId)

            const result = await createComparison(dummyComparison)

            expect(result).toBe(true)
        })
        it("should match both the provided users' profileId's when fetching them from the database", async () => {
            const dummyComparison: Comparison = new Comparison(globalDummyUser1.profileId, globalDummyUser2.profileId)

            await createComparison(dummyComparison)

            const getComparisonResult = await MongoComparison.findOne({ user1: dummyComparison.user1, user2: dummyComparison.user2 })

            expect(getComparisonResult).not.toBeNull()
        })
        it('should throw an error if we try adding a comparison that already exists', async () => {
            const dummyComparison: Comparison = new Comparison(globalDummyUser1.profileId, globalDummyUser2.profileId)

            await createComparison(dummyComparison)

            const result = async () => {
                await createComparison(dummyComparison)
            }

            expect(result).rejects.toThrow()
        })
    })
    describe('getComparison()', () => {
        let globalDummyComparison

        beforeEach(async () => {
            try {
                const dummyUser1 = new Profile('User1')
                const dummyUser2 = new Profile('User2')

                const dummyComparison = new Comparison(
                    dummyUser1.profileId,
                    dummyUser2.profileId
                )

                globalDummyComparison = dummyComparison

                await MongoComparison.create({
                    user1: dummyComparison.user1,
                    user2: dummyComparison.user2,
                    dateCreated: dummyComparison.dateCreated
                })
            } catch (error) {
                throw new Error('Error seeding database')
            }
        })
        it('should return a comparison object if ', async () => {
            const result = await getComparison(globalDummyComparison.user1, globalDummyComparison.user2)

            expect(result.user1).toBe(globalDummyComparison.user1)
            expect(result.user2).toBe(globalDummyComparison.user2)
        })
    })
    describe('deleteComparison()', () => {
        let globalDummyComparison

        beforeEach(async () => {
            try {
                const dummyUser1 = new Profile('User1')
                const dummyUser2 = new Profile('User2')

                const dummyComparison = new Comparison(
                    dummyUser1.profileId,
                    dummyUser2.profileId
                )

                globalDummyComparison = dummyComparison

                await MongoComparison.create({
                    user1: dummyComparison.user1,
                    user2: dummyComparison.user2,
                    dateCreated: dummyComparison.dateCreated
                })
            } catch (error) {
                throw new Error('Error seeding database')
            }
        })
        it('should return true if the comparison is deleted', async () => {
            const result = await deleteComparison(globalDummyComparison.user1, globalDummyComparison.user2)

            expect(result).toBe(true)
        })
        it('should find no comparison with both users profileIds', async () => {
            await deleteComparison(globalDummyComparison.user1, globalDummyComparison.user2)

            const isFoundUser = await MongoComparison.findOne({ user1: globalDummyComparison.user1, user2: globalDummyComparison.user2 })

            expect(isFoundUser).not.toBeTruthy()
        })
        it("should throw an error if we try to delete a comparison that doesn't exist", async () => {
            await deleteComparison(globalDummyComparison.user1, globalDummyComparison.user2)

            const result = async () => {
                await deleteComparison(globalDummyComparison.user1, globalDummyComparison.user2)
            }

            expect(result).rejects.toThrow()
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
            const profileIdToGetComparisonsFor: string = globalDummyUser2.profileId

            const foundComparisons = await getUsersComparisons(profileIdToGetComparisonsFor)

            expect(foundComparisons.length).toBe(2)
            expect(foundComparisons[0]).toBeInstanceOf(Comparison)
            expect(foundComparisons[1]).toBeInstanceOf(Comparison)
        })
        it('should return a an array that contains a Comparison matching the expect comparison object instance', async () => {
            const profileIdToGetComparisonsFor: string = globalDummyUser2.profileId
            const expectedComparisonResponse: Comparison = globalDummyComparison1

            const foundComparisons: Array<Comparison> = await getUsersComparisons(profileIdToGetComparisonsFor)

            expect(foundComparisons).toEqual(expect.arrayContaining([expectedComparisonResponse]))
        })
        it('should return an empty array if no comparisons are found for the specified userId', async () => {
            const profileIdToGetComparisonsFor: string = 'fakeProfileId'

            const foundComparisons = await getUsersComparisons(profileIdToGetComparisonsFor)

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