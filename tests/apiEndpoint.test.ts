/*
* @group integration
* @group api
*/

import * as dotenv from "dotenv";
import * as path from "path";
import supertest from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from "mongodb-memory-server"

import App from '../src/lib/app'
import {
    MongoProfile,
    MongoComparison
} from '../src/lib/connect-mongo'
import { Profile } from "../src/models/Profile"

// Global Setup
dotenv.config({ path: path.join(__dirname, "./test.env") })

const accessToken = process.env.SPOTIFY_API_ACCESS_TOKEN
const expiredAccessToken: string = "Bearer BQApufA5PhGh4PmvaLyOkglqrs6VvFykLPpKj2Gp6g_IjmU9MmfE8G583fF70p89RUs73jQdqOJqPBtp8ll_EI4M_Z7I4bwILY0pMn46qUHg1HKY0erJmCS17XlH8SI-8CY_EiTF0wqhMTFZ4GtLA_S0FKt-PwM-J2SNkIzomxXqpYIEecpAkWPAehUCCG8Qtk3jkTEd3KC2Orb5gg"
const invalidAccessToken: string = 'invalidToken'

const app = new App().express

// Setup mongo memory server
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

describe('GET /user endpoint', () => {
    beforeAll(async () => {
        const newProfile = new Profile('whitekidfromtheblock')

        await newProfile.save()
    })

    it('should return a statuscode of 200 and body containing user\'s profile from a valid access token', async () => {
        const { statusCode, body } = await supertest(app).get('/user').set({ 'Authorization': accessToken })

        expect(statusCode).toBe(200)
        expect(body.data.spotifyUsername).toBe('whitekidfromtheblock')
    })
    it('should return a statuscode of 400 if an invaid access token is provided', async () => {
        const { statusCode } = await supertest(app).get('/user').set({ 'Authorization': invalidAccessToken })

        expect(statusCode).toBe(400)
    })
    it('should return a statuscode of 401 if an expired access token is provided', async () => {
        const { statusCode } = await supertest(app).get('/user').set({ 'Authorization': expiredAccessToken })

        expect(statusCode).toBe(401)
    })
    it('should return a statuscode of 404 if the user doesn\'t exist in the database', async () => {
        await supertest(app).delete('/user').set({ 'Authorization': accessToken })

        const { statusCode } = await supertest(app).get('/user').set({ 'Authorization': accessToken })

        expect(statusCode).toBe(404)
    })
})
describe("DELETE /user endpoint", () => {
    beforeAll(async () => {
        const newProfile = new Profile('whitekidfromtheblock')

        await newProfile.save()
    })
    it('should return a statuscode of 200 if the user from the access token was deleted', async () => {
        const { statusCode } = await supertest(app).delete('/user').set({ 'Authorization': accessToken })

        expect(statusCode).toBe(200)
    })

    it('should return a statuscode of 400 if an invalid access token is provided', async () => {
        const { statusCode } = await supertest(app).delete('/user').set({ 'Authorization': invalidAccessToken })

        expect(statusCode).toBe(400)
    })

    it('should return a statuscode of 401 if an expired access token is provided', async () => {
        const { statusCode } = await supertest(app).delete('/user').set({ 'Authorization': expiredAccessToken })

        expect(statusCode).toBe(401)
    })

    it("should return a statuscode of 404 if the user doesn\'t exist in the database", async () => {
        await supertest(app).delete('/user').set({ 'Authorization': accessToken })

        const { statusCode } = await supertest(app).delete('/user').set({ 'Authorization': accessToken })

        expect(statusCode).toBe(404)
    })
})
describe('GET /user/analysis endpoint', () => {
    jest.setTimeout(50000)
    beforeAll(async () => {

        const newProfile = new Profile('whitekidfromtheblock')

        await newProfile.save()
    })
    it('should return 200', async () => {
        const { statusCode, body } = await supertest(app).get("/user/analysis").set({ 'Authorization': accessToken })

        expect(statusCode).toBe(200)
        expect(body.data.genres.length).toBeGreaterThan(0)
        expect(body.data.top50.tracks.length).toBeGreaterThan(0)
        expect(body.data.top50.artists.length).toBeGreaterThan(0)
    })
    it('should return 400', async () => {
        const { statusCode } = await supertest(app).get("/user/analysis").set({ 'Authorization': invalidAccessToken })

        expect(statusCode).toBe(400)
    })
    it('should return 401', async () => {
        const { statusCode } = await supertest(app).get("/user/analysis").set({ 'Authorization': expiredAccessToken })

        expect(statusCode).toBe(401)
    })
    it('should return 404', async () => {
        await supertest(app).delete('/user').set({ 'Authorization': accessToken })

        const { statusCode } = await supertest(app).get("/user/analysis").set({ 'Authorization': accessToken })

        expect(statusCode).toBe(404)
    })
})
describe('GET /user/top50 endpoint', () => {
    beforeAll(async () => {
        const newProfile = new Profile('whitekidfromtheblock')

        await newProfile.save()
    })
    it('should return 200', async () => {
        const { statusCode } = await supertest(app).get("/user/top50").set({ 'Authorization': accessToken })

        expect(statusCode).toBe(200)
    })
    it('should return 400', async () => {
        const { statusCode } = await supertest(app).get("/user/top50").set({ 'Authorization': invalidAccessToken })

        expect(statusCode).toBe(400)
    })
    it('should return 401', async () => {
        const { statusCode } = await supertest(app).get("/user/top50").set({ 'Authorization': expiredAccessToken })

        expect(statusCode).toBe(401)
    })
    it('should return 404', async () => {
        await supertest(app).delete('/user').set({ 'Authorization': accessToken })

        const { statusCode } = await supertest(app).get("/user/top50").set({ 'Authorization': accessToken })

        expect(statusCode).toBe(404)
    })
})
// Comparison tests can be written later since they comparison lgoci will need to entirely be changed
describe('GET /user/friends endpoint', () => {
})
describe('POST /comparison endpoint', () => {
    it('should return 201', async () => {
        
    })
    it('should return 400', async () => {

    })
    it('should return 401', async () => {

    })
    it('should return 404', async () => {

    })

})
describe('GET /comparison/:friendsSpotifyUsername endpoint', () => {
    it('should return 200', async () => {
        
    })
    it('should return 400', async () => {

    })
    it('should return 401', async () => {

    })
    it('should return 404', async () => {

    })
})
describe('DELETE /comparison/:friendsSpotifyUsername endpoint', () => {
    it('should return 200', async () => {
        
    })
    it('should return 400', async () => {

    })
    it('should return 401', async () => {

    })
    it('should return 404', async () => {

    })
})