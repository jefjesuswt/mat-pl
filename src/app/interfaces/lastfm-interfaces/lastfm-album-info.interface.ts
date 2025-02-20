export interface AlbumInfo {
    results: Results;
}

export interface Results {
    "opensearch:Query":        OpensearchQuery;
    "opensearch:totalResults": string;
    "opensearch:startIndex":   string;
    "opensearch:itemsPerPage": string;
    albummatches:              Albummatches;
    "@attr":                   Attr;
}

export interface Attr {
    for: string;
}

export interface Albummatches {
    album: Album[];
}

export interface Album {
    name:       string;
    artist:     string;
    url:        string;
    image:      Image[];
    streamable: string;
    mbid:       string;
}

export interface Image {
    "#text": string;
    size:    Size;
}

export enum Size {
    Extralarge = "extralarge",
    Large = "large",
    Medium = "medium",
    Small = "small",
}

export interface OpensearchQuery {
    "#text":     string;
    role:        string;
    searchTerms: string;
    startPage:   string;
}
