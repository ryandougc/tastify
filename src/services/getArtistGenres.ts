import axios from "axios";

import { IArtistEntry } from "../interfaces/IArtist";


export async function getArtistGenresService(mapOfArtists: Map<string, IArtistEntry>): Promise<Map<string, IArtistEntry>> {
    try {
        let arrayOfArtistIds = Array.from(mapOfArtists.keys());

        const rangeOfArtistIdsString = arrayOfArtistIds.toString();

        const artistRepsonse = await axios.get(
            `https://api.spotify.com/v1/artists?ids=${rangeOfArtistIdsString}`
        );

        // Push artist genres to artist map
        artistRepsonse.data.artists.forEach( artist => {
            mapOfArtists.get(artist.id).genres = artist.genres;
        });

        return mapOfArtists;
    } catch(err) {
        return undefined
    }
}