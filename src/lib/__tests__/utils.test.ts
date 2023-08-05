/*
* @group unit
*/

import { generateRandomString, sortUsernames } from "../utils";

describe("randomString()", () => {
    it("should return a random string whose length matches the number provided", async () => {
        const number = 6;

        const result = await generateRandomString(number);

        expect(result).toHaveLength(number);
    });
    it("should throw an error if a 0 is provided", async () => {
        const number = 0
        
        const resultFn = async () => {
            const randomString = await generateRandomString(number);
        }

        expect(resultFn).rejects.toThrow("generateRandomString() must be passed a 1 or higher")
    });
    it("should throw an error is a negative number is provided", async () => {
        const number = -6;

        const resultFn = async () => {
            const randomString = await generateRandomString(number);
        }

        expect(resultFn).rejects.toThrow("generateRandomString() must be passed a 1 or higher")
    });
});
describe('sortUsernames()', () => {
    it('should return an array with two items if two strings are provided', () => {
        const testUser1 = 'username1'
        const testUser2 = 'username2'

        const sortedUsers = sortUsernames(testUser1, testUser2)

        expect(sortedUsers).toHaveLength(2)
    })
    it('should return an array with the provided user2 input first and the user 1 input second', () => {
        const testUser1 = 'bapple'
        const testUser2 = 'apple'

        const sortedUsers = sortUsernames(testUser1, testUser2)

        expect(sortedUsers[0]).toBe(testUser2)
        expect(sortedUsers[1]).toBe(testUser1)
    })
    it('should throw an error is atleast 1 empty string is provided', () => {
        const testUser1 = 'username1'
        const testUser2 = ''

        const resultFn = () => {
            const sortedUsernames = sortUsernames(testUser1, testUser2)
        }

        expect(resultFn).toThrow("Username strings cannot be empty")
    })
})