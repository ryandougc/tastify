import * as express     from 'express'
import * as bodyParser  from 'body-parser'
import * as session     from 'express-session'
import      mongoose    from 'mongoose'

import DB from '../lib/db'

import { router as authRoutes } from '../routes/auth.route'
import { router as coreRoutes } from '../routes/core.route'

import { errorHandler, error404Handler } from '../routes/errorRoutes'
 
export default class App {
    public express
    public db

    constructor() {
        this.express = express()
        this.initBodyParser()
        this.initSessions()
        this.initDB()
        this.mountRoutes()
    }

    initBodyParser() {
        this.express.use(bodyParser.urlencoded({ extended: true }))

    }

    initSessions() {
        const SQLiteStore = require('connect-sqlite3')(session)

        this.express.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' }),
            cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
        }))
    }

    initDB() {
        mongoose.connect(process.env.MONGO_URL)
    }

    mountRoutes() {
        this.express.use('/auth', authRoutes)
        this.express.use('/', coreRoutes)
        this.express.use(errorHandler)
        this.express.use(error404Handler)
    }
}