import express from "express"
import * as bodyParser from "body-parser"
import mongoose, { ConnectOptions } from "mongoose"
import morgan from "morgan"

// import DB from './connect-pg'

import { router as authRoutes } from "../routes/auth.route"
import { router as coreRoutes } from "../routes/core.route"

import { errorHandler, error404Handler } from "../routes/errorRoutes"

export default class App {
    public express

    constructor() {
        this.express = express()
        this.initBodyParser()
        // this.initLogging()
        this.initDB()
        this.mountRoutes()
    }

    initBodyParser() {
        this.express.use(bodyParser.json({ type: 'application/json' }))
    }

    async initDB() {
        // Connect to the MongoDB database
        try {
            await mongoose.connect('mongodb+srv://ryan:Sportking11!@cluster0.v1mw48k.mongodb.net/?retryWrites=true&w=majority', {
                dbName: process.env.MONGO_DATABASE_NAME,
                useNewUrlParser: true,
                useUnifiedTopology: true
            } as ConnectOptions)
        } catch (error) {
            console.log('Database Connection Error')
        }
    }

    // initLogging() {
    //     morgan('tiny')
    // }

    mountRoutes() {
        this.express.use("/auth", authRoutes)
        this.express.use("/", coreRoutes)
        this.express.use(errorHandler)
        this.express.use(error404Handler)
    }
}
