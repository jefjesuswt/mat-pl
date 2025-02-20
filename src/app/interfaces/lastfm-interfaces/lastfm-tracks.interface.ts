export interface Data {
    results: Results;
}

export interface Results {
    "opensearch:Query":        OpensearchQuery;
    "opensearch:totalResults": string;
    "opensearch:startIndex":   string;
    "opensearch:itemsPerPage": string;
    trackmatches:              Trackmatches;
    "@attr":                   Attr;
}

export interface Attr {
}

export interface OpensearchQuery {
    "#text":   string;
    role:      string;
    startPage: string;
}

export interface Trackmatches {
    track: Track[];
}

export interface Track {
    name:       string;
    artist:     string;
    url:        string;
    streamable: Streamable;
    listeners:  string;
    image:      Image[];
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

export enum Streamable {
    Fixme = "FIXME",
}
