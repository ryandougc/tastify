import axios from "axios";
import * as fs from "fs";
import mongoose from "mongoose";

export function randomString(length: number): string {
    let string = "";
    let chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

    for (let i = 0; i < length; i++) {
        string += chars[Math.floor(Math.random() * chars.length)];
    }

    return string;
}

export async function getPlaylistTracks(
    usersPlaylistResponse
): Promise<string[]> {
    let tracks = [];
    let userPlaylistTrackLinks = [];
    //  usersPlaylists = const getUserOnePlaylistsResponse = await axios.get('https://api.spotify.com/v1/me/playlists?limit=50')

    const userPlaylists = usersPlaylistResponse.data.items;

    userPlaylists.forEach((playlist) => {
        const pages = Math.ceil(playlist.tracks.total / 50);

        if (pages > 1) {
            for (let i = 0; i <= pages; i++) {
                userPlaylistTrackLinks.push(
                    axios.get(
                        `${playlist.tracks.href}?limit=50&offest=${i * 50}`
                    )
                );
            }
        } else {
            userPlaylistTrackLinks.push(
                axios.get(`${playlist.tracks.href}?limit=50`)
            );
        }
    });

    const response = await axios.all(userPlaylistTrackLinks);

    response.forEach((paylistTracks) => {
        paylistTracks.data.items.forEach((track) => {
            tracks.push(track.track.id);
        });
    });

    // fs.writeFile('test.txt', tracks.toString(), function (err) {
    //     if (err) return console.log(err);
    //     console.log('Hello World > helloworld.txt');
    //   });

    return tracks;
}

export function hashMapMethod(arr1: string[], arr2: string[]) {
    let matchingElements = [];
    let hashMap = {};

    arr1.forEach((elem, i) => {
        if (hashMap[elem] !== undefined) {
            hashMap[elem] += 1;
        } else {
            hashMap[elem] = 1;
        }
    });

    arr2.forEach((elem, i) => {
        if (hashMap[elem] === -1) {
        } else if (hashMap[elem] > 0) {
            hashMap[elem] = -1;
        } else {
            hashMap[elem] = 1;
        }
    });

    let totalUniqueTracks = Object.keys(hashMap).length;

    for (let elem in hashMap) {
        if (hashMap[elem] === -1) {
            matchingElements.push(elem);
        }
    }

    return {
        matches: matchingElements,
        uniqueTracks: totalUniqueTracks,
    };
}

export async function getTrackDetails(tracks: string[]) {
    let trackData = [];
    let getTrackLinks = [];

    tracks.forEach((trackId) => {
        getTrackLinks.push(
            axios.get(`https://api.spotify.com/v1/tracks/${trackId}`)
        );
    });

    const response = await axios.all(getTrackLinks);

    response.forEach((track) => {
        trackData.push(track.data);
    });

    return trackData;
    // fs.writeFile('test.txt', tracks.toString(), function (err) {
    //     if (err) return console.log(err);
    //     console.log('Hello World > helloworld.txt');
    //   });
}

export function pushToHash(arr, hash): object {
    arr.forEach((item) => {
        const song = item.track;

        if (hash[song.id] === undefined) {
            hash[song.id] = {
                count: 1,
                artists: song.artists,
                duration: song.duration_ms,
                href: song.href,
                name: song.name,
                popularity: song.popularity,
                explicit: song.explicit,
            };
        } else {
            hash[song.id].occurrences += 1;
        }
    });

    return hash;
}

export function sortMapDesc(map) {
    const arrayFromMap = [...map];

    const sortedArray = arrayFromMap.sort((a, b) => b[1].count - a[1].count);

    return sortedArray;
}

export function getArrayFromMap(map) {
    const array = Array.from(map, ([name, value]) => ({ name, value }));

    return array;
}

export async function checkUserExistsInDb(userId) {
    const databaseUsers = await mongoose.connection.db
        .listCollections()
        .toArray();

    if (databaseUsers.find((x) => x.name === userId)) {
        return true;
    }

    return false;
}
