/*
* @group unit
*/

import getCurrentUserTracksService from "../getCurrentUserTracks"
import * as getLikedTracks from "../getLikedTracks";
import * as getPlaylistTracks from "../getPlaylistTracks";
import * as utils from "../../lib/utils"
import { getPublicUserTracksService } from "../getPublicUserTracks";


describe('getPublicUserTracks service', () => {
    beforeEach(() => {
        // jest.resetModules();
    });

    const fakeAccessToken: string = "1234567890"
    const fakeUserId: string = "username"


    describe("given a user id", () => {
        it("should return a map of all tracks", async () => {
            const mockGetPublicUserTracksService = jest.spyOn(getPlaylistTracks, 'getPlaylistTracksService').mockResolvedValueOnce([
                {
                    artists: [],
                    href: "https://ryancarr.ca",
                    id: "1234567890",
                    name: "test1",
                    type: "track"
                }
            ])


            // Mock the return value for pushtrackstomap with a fake map of the data 
            const mockPushTrackToMapAsTrackEntry = jest.spyOn(utils, 'pushTrackToMapAsTrackEntry').mockResolvedValueOnce([
                {
                    artists: [],
                    href: "https://ryancarr.ca",
                    id: "1234567890",
                    name: "test1",
                    type: "track"
                }
            ])

            const allTracks = await getPublicUserTracksService(fakeAccessToken, fakeUserId)

            expect(allTracks.get("1234567890")).toEqual({
                artists: [],
                href: "https://ryancarr.ca",
                id: "1234567890",
                name: "test1",
                type: "track",
                count: 1
            })
            expect(mockGetPublicUserTracksService).toHaveBeenCalledTimes(1)
        })
    })
    describe("given the user has no playlists", () => {
        it("Should return an empty map", async () => {
            const mockGetPublicUserTracksService = jest.spyOn(getPlaylistTracks, 'getPlaylistTracksService').mockResolvedValueOnce([])

            const allTracks = await getCurrentUserTracksService(fakeAccessToken)

            expect(allTracks.size).toEqual(0)

            expect(mockGetPublicUserTracksService).toHaveBeenCalledTimes(1)
        })
    })
})