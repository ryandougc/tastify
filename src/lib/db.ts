import mongoose from 'mongoose'

// import          userSchema          from './models/user'
// import          firearmSchema       from './models/firearm'

export default class {
    constructor() {
        this.connect()
    }

    async connect() {
        try {
            await mongoose.connect(process.env.MONGO_URL)

            console.log("Mongoose has Connected")
        } catch (err) {
            console.log("Mongoose failed to connect")
            console.log(err)
        }
    }
}