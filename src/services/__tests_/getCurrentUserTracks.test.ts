/*
* @group unit
*/

import getCurrentUserTracksService from "../getCurrentUserTracks"
import * as getLikedTracks from "../getLikedTracks";
import * as getPlaylistTracks from "../getPlaylistTracks";


describe('getCurrentUserTracks service', () => {
    beforeEach(() => {
        // jest.resetModules();

    });

    const fakeAccessToken: string = "1234567890"


    describe("given a user id", () => {
        it("should return a map of all tracks", async () => {
            const mockGetLikedTracksService = jest.spyOn(getLikedTracks, 'getLikedTracksService').mockResolvedValueOnce([
                {
                    artists: [],
                    href: "https://ryancarr.ca",
                    id: "1234567890",
                    name: "test1",
                    type: "track"
                }
            ])
            const mockGetPlaylistTracksService = jest.spyOn(getPlaylistTracks, 'getPlaylistTracksService').mockResolvedValueOnce([
                {
                    artists: [],
                    href: "https://google.ca",
                    id: "098765321",
                    name: "test2",
                    type: "track"
                }
            ])

            const allTracks = await getCurrentUserTracksService(fakeAccessToken)

            expect(allTracks.get("1234567890")).toEqual({
                artists: [],
                href: "https://ryancarr.ca",
                id: "1234567890",
                name: "test1",
                type: "track",
                count: 1
            })
            expect(mockGetLikedTracksService).toHaveBeenCalledTimes(1)
            expect(mockGetPlaylistTracksService).toHaveBeenCalledTimes(1)
        })
    })
    describe("given the user has no liked tracks", () => {
        it("Should return a map of all the tracks from getPlayistTracksService", async () => {
            const mockGetLikedTracksService = jest.spyOn(getLikedTracks, 'getLikedTracksService').mockResolvedValueOnce([])
            const mockGetPlaylistTracksService = jest.spyOn(getPlaylistTracks, 'getPlaylistTracksService').mockResolvedValueOnce([
                {
                    artists: [],
                    href: "https://google.ca",
                    id: "098765321",
                    name: "test2",
                    type: "track"
                }
            ])

            const allTracks = await getCurrentUserTracksService(fakeAccessToken)

            expect(allTracks.get("098765321")).toEqual({
                artists: [],
                href: "https://google.ca",
                id: "098765321",
                name: "test2",
                type: "track",
                count: 1
            })
            expect(mockGetLikedTracksService).toHaveBeenCalledTimes(1)
            expect(mockGetPlaylistTracksService).toHaveBeenCalledTimes(1)
        })
    })
})