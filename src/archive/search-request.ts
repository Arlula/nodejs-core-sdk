
export default class SearchRequest {
    private start: Date;
    private end?: Date;
    private res: number = Resolution.veryLow;
    private point?: {long:number,lat:number};
    private box?: {west: number, north: number, east: number, south: number};

    constructor(date: Date) {
        this.start = date;
    }

    searchFrom(date: Date) {
        this.start = date;
    }

    searchTo(date: Date) {
        this.end = date;
    }

    searchDateRange(start: Date, end: Date) {
        this.start = start;
        this.end = end;
    }

    searchPoint(long: number, lat: number) {
        this.box = undefined;
        this.point = {long, lat};
    }

    searchBoundingBox(west: number, north: number, east: number, south: number) {
        this.point = undefined;
        this.box = {west, north, east, south};
    }

    setMaximumResolution(res: number|Resolution) {
        this.res = res;
    }

    valid(): boolean {
        return !!(this.start && this.res > 0 && (this.point || this.box));
    }

    toQuery(): {[key: string]: string} {
        const query: {[key: string]: string} = {
            start: this.start.toString(),
            res: this.res.toString(),
        };

        if (this.end) {
            query.end = this.end.toString();
        }

        if (this.point) {
            query.lat = this.point.lat.toString();
            query.long = this.point.long.toString();
        }

        if (this.box) {
            query.west = this.box.west.toString();
            query.north = this.box.north.toString();
            query.east = this.box.east.toString();
            query.south = this.box.south.toString();
        }

        return query;
    }
}

export enum Resolution {
    veryHigh = 0.5,
    high = 1,
    medium = 5,
    low = 20,
    veryLow = 100000,
}
