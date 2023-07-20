/*
* @group integration
* @group api
*/
import * as dotenv from "dotenv";
import * as path from "path";
import * as supertest from 'supertest'
import mongoose from 'mongoose'
import App from '../src/lib/app'
import * as db from '../src/lib/dbDriver'
import {
    MongoProfile,
    MongoComparison
} from '../src/lib/connect-mongo'

// Global Setup
dotenv.config({ path: path.join(__dirname, "../.env") });
const app = new App().express

describe('POST /user', () => {
    afterEach(async () => {
        // Remove the test document from the database after the tests
        await MongoProfile.deleteMany({})
        await MongoComparison.deleteMany({})
    })

    afterAll(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect()
        }
    });
    it('should create and save a profile to the database, returning http status 201', async () => {
            const bodyParams = "fakeSpotifyUsername"

            const { statusCode } = await supertest(app).post('/user').send({ spotifyUsername: bodyParams }).set('Content-Type', 'application/json')
    
            expect(statusCode).toBe(201)
    })
    it('should create and save a profile to the database and return the user profile when queried', async () => {
        const bodyParams = "fakeSpotifyUsername"

        await supertest(app).post('/user').send({ spotifyUsername: bodyParams }).set('Content-Type', 'application/json')

        const foundUser = await db.getUserProfileBySpotifyUsername(bodyParams)

        expect(foundUser.spotifyUsername).toBe(bodyParams)
    })
    it('should return error 400 and error message if the spotifyUsername body parameter is not sent with the request', async () => {
        const { statusCode, body } = await supertest(app).post('/user').send({ /* Nothing */ })

        expect(statusCode).toBe(400)
        expect(body.success).toBe(false)
        expect(body.message[0].msg).toEqual('Invalid spotifyUsername')
    })
})