import { IArtist } from "./IArtist";

export interface ITrackHolder {
    href: string;
    items: Array<ITrack>;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
}

export interface ITrack {
    artists: Array<{ name: string, id: string }>;
    href: string;
    id: string;
    name: string;
    type: 'track' | 'Track' 
}

export interface ITrackEntry extends ITrack {
    count: number;
}

export interface ITracklist extends Array<ITrack> {}