import * as mongoose from "mongoose";

export default new mongoose.Schema({
    trackId: String,
    count: Number,
    apiLink: String,
    artists: [
        {
            artistId: String,
            apiLink: String,
            name: String,
            popularity: Number,
            genres: [String],
        },
    ],
    popularity: Number,
    audioFeatures: {
        acousticness: Number,
        danceability: Number,
        duration_ms: Number,
        energy: Number,
        id: Number,
        instrumentalness: Number,
        key: Number,
        liveness: Number,
        loudness: Number,
        mode: Number,
        speechiness: Number,
        tempo: Number,
        time_signature: Number,
        valence: Number,
    },
});
