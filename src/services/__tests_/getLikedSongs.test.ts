/*
* @group unit
*/


import axios from "axios";
import { getLikedTracksService } from "../getLikedTracks";

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe('getLikedTracks service', () => {
    describe('given there are no errors', () => {
        it('should return an array of tracks', async () => {
            mockedAxios.get.mockResolvedValue({ data: { 
                items: [
                    { 
                        artists: [],
                        href: "",
                        id: "",
                        name: "",
                        type: ""
                    }
                ], next: "" 
            } })
            
            const response = await getLikedTracksService()

            expect(response).toEqual([
                { 
                    artists: [],
                    href: "",
                    id: "",
                    name: "",
                    type: ""
                }
            ])
            expect(mockedAxios.get).toHaveBeenCalledTimes(1)
        })
    })
    describe('given there are no items returned from the API', () => {
        it('should return null', async () => {
            mockedAxios.get.mockResolvedValue({ data: { items: [], next: "" } })
            
            const response = await getLikedTracksService()

            expect(response).toEqual([])
            expect(mockedAxios.get).toHaveBeenCalledTimes(1)
        })
    })
    describe('given there is an error returning from the API', () => {
        it('should return undefined', async () => {
            mockedAxios.get.mockResolvedValue(undefined)
            
            const response = await getLikedTracksService()

            expect(response).toEqual(undefined)
            expect(mockedAxios.get).toHaveBeenCalledTimes(1)
        })
    })
})  