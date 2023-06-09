import mongoose from "mongoose";

import genreSchema from "../models/genre.model";

export async function getUserDataFromDbService(userId) {
    const Genre = mongoose.model("Genre", genreSchema, userId);

    const rawGenreData = await Genre.find({});

    const genreBreakdown = new Map(
        rawGenreData.map((obj) => {
            return [obj.name, obj.value];
        })
    );

    return genreBreakdown;
}
