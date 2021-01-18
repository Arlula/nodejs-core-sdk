export default class SearchRequest {
    private start;
    private end?;
    private res;
    private point?;
    private box?;
    constructor(date: Date);
    searchFrom(date: Date): void;
    searchTo(date: Date): void;
    searchDateRange(start: Date, end: Date): void;
    searchPoint(long: number, lat: number): void;
    searchBoundingBox(west: number, north: number, east: number, south: number): void;
    setMaximumResolution(res: number | Resolution): void;
    valid(): boolean;
    toQuery(): {
        [key: string]: string;
    };
}
export declare enum Resolution {
    veryHigh = 0.5,
    high = 1,
    medium = 5,
    low = 20,
    veryLow = 100000
}
