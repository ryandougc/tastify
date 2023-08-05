import { v4 as uuidv4 } from 'uuid'

export function generateRandomString(length: number): string {
    if(length <= 0) throw new Error('generateRandomString() must be passed a 1 or higher')

    let string = ""
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"

    for (let i = 0; i < length; i++) {
        string += chars[Math.floor(Math.random() * chars.length)]
    }

    return string
}

export function generateUserId(): string {
    try {
        return uuidv4()
    } catch(error) {
        throw new Error(`Error generating profileId: ${error}`)
    }
}

export function sortUsernames(user1: string, user2: string): Array<string> {
    if(user1 === "" || user2 === "") throw new Error("Username strings cannot be empty")

    if(user1 <= user2) return [user1, user2]
    return [user2, user1]
}