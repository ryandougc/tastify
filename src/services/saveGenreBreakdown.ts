import mongoose from "mongoose";

import { getArrayFromMap } from "../lib/utils";

import genreSchema from "../models/genre.model";

export async function saveGenreBreakdownService(genreBreakdown, userId) {
    const Genre = mongoose.model("Genre", genreSchema, userId);

    const genresArray = getArrayFromMap(genreBreakdown);

    Genre.collection.deleteMany({});

    Genre.insertMany(genresArray);
}
