import express from "express"
import session from 'express-session'
import * as bodyParser from "body-parser"
import mongoose, { ConnectOptions } from "mongoose"
import morgan from "morgan"

import { router as authRoutes } from "../routes/auth.route"
import { router as coreRoutes } from "../routes/core.route"

import { errorHandler, error404Handler } from "../middleware/errorHandler"

import { generateRandomString } from './utils'

export default class App {
    public express

    constructor() {
        this.express = express()
        this.initSessions()
        this.initBodyParser()
        // this.initLogging()
        this.initDB()
        this.mountRoutes()
    }

    initSessions() {
        this.express.use(session({
            secret: generateRandomString(21),
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false }
          }))
    }
    
    initBodyParser() {
        this.express.use(bodyParser.json({ type: 'application/json' }))
    }

    async initDB() {
        try {
            if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
                await mongoose.connect(process.env.MONGO_DATABASE_URL, {
                    dbName: process.env.MONGO_DATABASE_NAME,
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                } as ConnectOptions)
            }
        } catch (error) {
            throw new Error(error.message)
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
