/*
* @group unit
* @group model
*/

import { Comparison } from '../Comparison'

import { createComparison, getComparison, deleteComparison } from '../../lib/dbDriver'
import { Profile } from '../Profile'

const dummyUser1 = new Profile('user1')
const dummyUser2 = new Profile('user2')

jest.mock('../../lib/dbDriver', () => {
    return {
        createComparison: jest.fn(),
        getComparison: jest.fn(),
        deleteComparison: jest.fn(),
    }
})


jest.mock('../../lib/utils', () => {
    return { 
        sortUsernames: (user1, user2) => {
            if(user1 > user2) return [user2, user1]

            return [user1, user2]
        },
        generateUserId: () => {
            const length = 12
            let string = "";
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        
            for (let i = 0; i < length; i++) {
                string += chars[Math.floor(Math.random() * chars.length)];
            }
        
            return string;
        }
    }
})

describe('Comparison Class', () => {
    describe('constructor', () => {
        it('should create a class instance with the given properties user1, user2', () => {
            const testUser1 = "username1"
            const testUser2  = "username2"
    
            const comparisonClassResult = new Comparison(testUser1, testUser2)
    
            expect(comparisonClassResult).toHaveProperty('user1')
            expect(comparisonClassResult).toHaveProperty('user2')
            expect(comparisonClassResult).toHaveProperty('dateCreated')
        })
        it('should create a class instance with a name user1 that matches the lesser of user1 and user2', () => {
            const testUser1 = "ccc"
            const testUser2  = "aaa"
    
            const comparisonClassResult = new Comparison(testUser1, testUser2) // Mock sortUsernames()
     
            expect(comparisonClassResult.user1).toBe(testUser2)
        })
    })
    describe('method save()', () => {
        it('should save the provided comparison in the database and not throw an error', () => {
            const testUserId1 = 'id1'
            const testUserId2 = 'id2'
    
            const testComparison = new Comparison(testUserId1, testUserId2)
    
            const resultFn = async () => {
                await testComparison.save()
            }
    
            expect(resultFn).not.toThrow()
        })
        it('should call the dbdriver function mock createComparison() for the provided comparison', async () => {
            const testUserId1 = 'id1'
            const testUserId2 = 'id2'
    
            const testComparison = new Comparison(testUserId1, testUserId2)
    
            await testComparison.save()
    
            expect(createComparison).toBeCalled()
        })
        it('should throw an error if the comparison fails to save in the database', () => {
            jest.mocked(createComparison).mockImplementation((comparison: Comparison) => {
                return new Promise((resolve, reject) => {
                    reject(new Error(""))
                })
            })
            
            const testUserId1 = 'id1'
            const testUserId2 = 'id2'
    
            const testComparison = new Comparison(testUserId1, testUserId2)
    
            const resultFn = async () => {
                await testComparison.save()
            }
  
            expect(resultFn).rejects.toThrow()
        })
    })
    describe('method get()', () => {
        it('should return a Comparison object for the user profiles provided', async () => {
            jest.mocked(getComparison).mockImplementation((user1: string, user2: string) => {
                const dummyComparison = new Comparison(dummyUser1.profileId, dummyUser2.profileId)

                return new Promise((resolve, reject) => {
                    resolve(dummyComparison)
                })
            })

            const foundComparison = await Comparison.get(dummyUser1.profileId, dummyUser2.profileId)

            expect(foundComparison).toBeInstanceOf(Comparison)
        })
        it('should not throw when fetching a valid user profile', () => {
            jest.mocked(getComparison).mockImplementation((user1: string, user2: string) => {
                const dummyComparison = new Comparison(dummyUser1.profileId, dummyUser2.profileId)

                return new Promise((resolve, reject) => {
                    resolve(dummyComparison)
                })
            })

            const result = async () => {
                const foundComparison = await getComparison(dummyUser1.profileId, dummyUser2.profileId)
            }

            expect(result).not.toThrow()
        })
        
        it('should throw when fetching an invalid user profile', () => {
            jest.mocked(getComparison).mockImplementation((user1: string, user2: string) => {
                return new Promise((resolve, reject) => {
                    reject(new Error(""))
                })
            })

            const result = async () => {
                const foundComparison = await getComparison(dummyUser1.profileId, dummyUser2.profileId)
            }

            expect(result).rejects.toThrow()
        })
    })
    describe('method delete()', () => {
        it('should delete the specified comparison and call the deleteComparison() function', async () => {
            const fakeComparison: Comparison = new Comparison('fake-user-1', 'fake-user-2')

            await fakeComparison.delete()

            expect(deleteComparison).toBeCalled()
        })
        it('should throw an error if th deleteComparison() function fails', () => {
            jest.mocked(deleteComparison).mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    reject(new Error("Error when deleting a comparison"))
                })
            })

            const fakeComparison: Comparison = new Comparison('fake-user-1', 'fake-user-2')

            const resultFn = async () => {
                await fakeComparison.delete()
            }

            expect(resultFn).rejects.toThrow()
        })
    })
})