import { Schema }   from 'mongoose'        

export default new Schema({
    username: String,
    spotifyUserId: String,
    dateCreated: Date,
    dateLastRetrievedData: Date
})