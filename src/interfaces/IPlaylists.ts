export interface IPlaylists {
    items: Array<Object>;
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
}

export interface IPlaylistItem {
    collaborative: boolean,
    description: string,
    external_urls: Object,
    href: string,
    id: string,
    images: Array<Object>,
    name: string,
    owner: Object,
    public: boolean,
    snapshot_id: string,
    tracks: Object,
    type: string,
    uri: string
}