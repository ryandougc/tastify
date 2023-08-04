/*
* @group unit
* @group model
*/

import {
    createUserProfile,
    updateUserProfile,
    checkUserProfileExists,
    getUserProfile,
    deleteUserProfile,
    deleteAllUsersComparisons,
    getUsersComparisons,
    getUserProfileBySpotifyUsername,
} from '../../lib/dbDriver'
import { Profile } from '../Profile'
import { Analysis } from '../Analysis'
import { Genre } from '../Genre'
import { Comparison } from '../Comparison'
import { Track } from '../Track'
import { getTop50Service } from '../../services/getTop50'
import { Artist } from '../Artist'
import { Top50 } from '../../lib/types'

jest.mock('../../lib/utils', () => {
    return {
        generateUserId: jest.fn(() => {
            return '1a2b3c4d5e'
        })
    }
})
jest.mock('../../lib/dbDriver', () => {
    return {
        createUserProfile: jest.fn(() => {
            return new Promise<void>((resolve, reject) => {
                resolve()
            })
        }),
        updateUserProfile: jest.fn(() => {
            return new Promise<void>((resolve, reject) => {
                resolve()
            })
        }),
        checkUserProfileExists: jest.fn(),
        // getUserProfile: jest.fn(),
        deleteAllUsersComparisons: jest.fn(),
        deleteUserProfile: jest.fn(),
        getUsersComparisons: jest.fn(),
        getUserProfileBySpotifyUsername: jest.fn(),
    }
})
jest.mock('../../models/Comparison')
jest.mock('../../services/getTop50', () => {
    return {
        getTop50Service: jest.fn(),
    }
})

describe('class Profile', () => {
    describe('constructor', () => {
        it('should create a class instance with the given username', () => {
            const testSpotifyUsername = "Username"

            const profileClassResult = new Profile(testSpotifyUsername)

            expect(profileClassResult.spotifyUsername).toBe(testSpotifyUsername)
        })
        it('should create a class instance with properties spotifyUsername, profileId, dateCreated, and analysis', () => {
            const testSpotifyUsername = "Username"

            const profileClassResult = new Profile(testSpotifyUsername)

            expect(profileClassResult).toHaveProperty('spotifyUsername')
            expect(profileClassResult).toHaveProperty('profileId')
            expect(profileClassResult).toHaveProperty('dateCreated')
            expect(profileClassResult).toHaveProperty('analysis')
        })
    })
    describe('method save()', () => {
        it('should not throw an error when saving a user and creating a new database entry for the profile provided', () => {
            jest.mocked(checkUserProfileExists).mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    resolve(false)
                })
            })

            const testProfile = new Profile('testusername')

            const resultFn = async () => {
                await testProfile.save()
            }

            expect(resultFn).not.toThrow()
        })
        it('should call the mocked createUserProfile() when attempting to save the profile provided', async () => {
            jest.mocked(checkUserProfileExists).mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    resolve(false)
                })
            })

            const testProfile = new Profile('testusername')

            await testProfile.save()

            expect(createUserProfile).toBeCalled()
        })
        it('should not throw an error when saving a user and updating an existing database entry for the profile provided', () => {
            jest.mocked(checkUserProfileExists).mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    resolve(true)
                })
            })

            const testProfile = new Profile('testusername')

            const resultFn = async () => {
                await testProfile.save()
            }

            expect(resultFn).not.toThrow()
        })
        it('should call the mocked updateUserProfile() when attempting to save the profile provided', async () => {
            jest.mocked(checkUserProfileExists).mockImplementation((): Promise<boolean> => {
                return new Promise((resolve, reject) => {
                    resolve(true)
                })
            })

            const testProfile = new Profile('testusername')

            await testProfile.save()

            expect(updateUserProfile).toBeCalled()
        })
    })
    describe('method generateAnalysis()', () => {
        it('should generate an analysis and assign it to the analysis property of the profile provided', async () => {
            const testProfile = new Profile('testProfile')
            const testGenre = new Genre("Country", 1, [], [])
            const testGenreAnalysis = []
            testGenreAnalysis.push(testGenre)

            let generateAnalysisSpy = jest.spyOn(testProfile.analysis, 'generateAnalysis').mockResolvedValue(new Analysis(testGenreAnalysis))

            await testProfile.generateAnalysis()

            console.log(testProfile.analysis)

            expect(testProfile.analysis.genres.length).toBeGreaterThan(0)

            generateAnalysisSpy.mockRestore()
        })
        it('should not throw an error when generating a new analysis', () => {
            const testProfile = new Profile('testProfile')
            const testGenre = new Genre("Country", 1, [], [])
            const testGenreAnalysis = [testGenre]

            let generateAnalysisSpy = jest.spyOn(testProfile.analysis, 'generateAnalysis').mockResolvedValue(new Analysis(testGenreAnalysis))

            const resultFn = async () => {
                await testProfile.generateAnalysis()
            }

            expect(resultFn).not.toThrow()

            generateAnalysisSpy.mockRestore()
        })
    })
    describe('method getUserProfile()', () => {
        it("should throw error when getting a user profile with a spotifyUsername that doesn't exist", () => {
            const invalidSpotifyUsername = 'invalidSpotifyUsername'

            jest.mocked(getUserProfileBySpotifyUsername).mockImplementation(async (spotifyUsername: string) => {
                return new Promise((reject, resolve) => { throw new Error("A user doesn't exist with that spotify username") })
            })

            const resultFn = async () => {
                const profile = await Profile.getUserProfile(invalidSpotifyUsername)
            }

            expect(resultFn).rejects.toThrow("A user doesn't exist with that spotify username")
        })
        it('should return a users profile mathcing the profileId provided', async () => {
            jest.mocked(getUserProfileBySpotifyUsername).mockImplementation(async (spotifyUsername: string) => {
                return new Promise((resolve, reject) => {
                    const testProfile = new Profile(spotifyUsername)

                    resolve(testProfile)
                })
            })

            const validSpotifyUsername: string = "Tastify"

            const resultProfile = await Profile.getUserProfile(validSpotifyUsername)

            expect(resultProfile).toBeInstanceOf(Profile)
            expect(resultProfile.spotifyUsername).toBe(validSpotifyUsername)
        })
    })
    describe('method delete()', () => {
        it("should call deleteAllUsersComparisons and deleteUserProfile when deleting a profile", async () => {
            jest.mocked(deleteAllUsersComparisons).mockImplementation(async (spotifyUsername: string) => {
                return new Promise((resolve, reject) => {
                    resolve(true)
                })
            })

            jest.mocked(deleteUserProfile).mockImplementation(async (spotifyUsername: string) => {
                return new Promise((resolve, reject) => {
                    resolve(true)
                })
            })

            const dummyProfile: Profile = new Profile('dummy-profile')

            await dummyProfile.delete()

            expect(deleteAllUsersComparisons).toHaveBeenCalledTimes(0)
            expect(deleteUserProfile).toHaveBeenCalled()
        })
    })
    describe('method getTop50', () => {
        it('should return an array of Track class instance', async () => {
            jest.mocked(getTop50Service).mockImplementation(async (): Promise<Top50> => {
                return new Promise<Top50>((resolve, reject) => {
                    resolve({
                        tracks: [
                            new Track(
                                [new Artist(
                                    [],
                                    'fake-artist-href',
                                    'fake-artist-id',
                                    'fake-artist-name'
                                )],
                                'fake-track-link',
                                'fake-track-id',
                                'fake-track-name',
                                'track'
                            )
                        ],
                        artists: []
                    })
                })
            })

            const dummyProfile = new Profile("dummy-name")

            const foundTop50 = await dummyProfile.getTop50()

            expect(foundTop50.tracks.length).toBeGreaterThan(0)
        })
    })
    describe('method getUsersListOfComparisons()', () => {
        it("should call the getUsersComparisons() method when retrieving all a users comparisons", async () => {
            jest.mocked(getUsersComparisons).mockImplementation((): Promise<Array<Comparison>> => {
                return new Promise((resolve, reject) => {
                    resolve([])
                })
            })

            const dummyProfile = new Profile('dummy-profile')

            await dummyProfile.getUsersListOfComparisons()

            expect(getUsersComparisons).toBeCalled()
        })
        it('should return an empty array if the user has no comparisons', async () => {
            jest.mocked(getUsersComparisons).mockImplementation((): Promise<Array<Comparison>> => {
                return new Promise((resolve, reject) => {
                    resolve([])
                })
            })

            const dummyProfile = new Profile('dummy-profile')

            const foundComparisons: Array<Comparison> = await dummyProfile.getUsersListOfComparisons()

            expect(foundComparisons).toEqual([])
        })
        it('should return an an array with a comparison', async () => {
            const dummyComparison: Comparison = new Comparison("username1", "username2")

            jest.mocked(getUsersComparisons).mockImplementation((): Promise<Array<Comparison>> => {
                return new Promise((resolve, reject) => {
                    resolve([dummyComparison])
                })
            })

            const dummyProfile = new Profile('dummy-profile')

            const foundComparisons: Array<Comparison> = await dummyProfile.getUsersListOfComparisons()

            expect(foundComparisons).toEqual(expect.arrayContaining([dummyComparison]))
        })
    })
})