import { Schema } from "mongoose";

export default new Schema({
    name: String,
    value: {
        count: Number,
        tracks: [
            {
                trackId: String,
                trackName: String,
                artistId: String,
                artistName: String,
            },
        ],
    },
});
