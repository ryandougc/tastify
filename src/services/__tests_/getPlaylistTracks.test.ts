/*
* @group unit
*/

import axios from "axios";
import { getPlaylistTracksService } from "../getPlaylistTracks";

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;

const fakeUserId: string = '123456789'


describe('getplaylistTracks service', () => {
    describe('given there are no errors', () => {
        it('should return an array of tracks', async () => {
            mockedAxios.get.mockResolvedValue({ data: {
                items: [
                 {
                    tracks: {
                        href: "url-goes-here"
                    }
                 }   
                ],
                next: ""
            }})
            
            const response = await getPlaylistTracksService(fakeUserId)

            expect(response).toEqual([
                {
                    tracks: {
                        href: "url-goes-here"
                    }
                }   
            ])
            expect(mockedAxios.get).toHaveBeenCalledTimes(2)
        })
    })
    describe('given there are no items returned from the API', () => {
        it('should return undefined', async () => {
            mockedAxios.get.mockResolvedValue({ data: {
                items: [],
                next: ""
            }})
            
            const response = await getPlaylistTracksService(fakeUserId)

            expect(response).toEqual([])
            expect(mockedAxios.get).toHaveBeenCalledTimes(1)
        })
    })
    describe('given there is an error returning from the API', () => {
        it('should return undefined', async () => {
            mockedAxios.get.mockResolvedValue(undefined)
            
            const response = await getPlaylistTracksService(fakeUserId)

            expect(response).toEqual(undefined)
            expect(mockedAxios.get).toHaveBeenCalledTimes(1)
        })
    })
})