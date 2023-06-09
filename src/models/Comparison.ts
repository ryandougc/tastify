import { sortUsernames } from "../lib/utils"
import {
    createComparison,
    deleteComparison,
    getComparison
} from "../lib/dbDriver"

export interface Comparison {
    user1: string
    user2: string
    dateCreated: Date
}

export class Comparison implements Comparison {
    constructor(user1: string, user2: string, dateCreated?) {
        this.user1 = sortUsernames(user1, user2)[0]
        this.user2 = sortUsernames(user1, user2)[1]
        this.dateCreated = dateCreated || new Date()
    }

    async save(): Promise<void> {
        try {
            await createComparison(this)
        } catch(error) {
            throw new Error('Error while saving a comparison')
        }
    }

    async delete(): Promise<void> {
        try {
            await deleteComparison(this.user1, this.user2)
        } catch(error) {
            throw new Error('Error while deleting a comparison')
        }
    }

    static async get(user1: string, user2: string): Promise<Comparison> {
        try {
            const userProfileIds: Array<string> = user1 <= user2 ? [user1, user2] : [user2, user1]

            const foundComparison: Comparison = await getComparison(userProfileIds[0], userProfileIds[1])

            return foundComparison
        } catch(error) {
            throw new Error(`Error while fetching comparison: ${error}`)
        }
    }
}