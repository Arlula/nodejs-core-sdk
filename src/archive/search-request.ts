
export default class SearchRequest {
    private _start: Date;
    private _end?: Date;
    private _res: number = Resolution.veryLow;
    private _point?: {long:number,lat:number};
    private _box?: {west: number, north: number, east: number, south: number};

    constructor(date: Date) {
        this._start = date;
    }

    atDate(date: Date): SearchRequest {
        this._end = undefined;
        this._start = date;
        return this;
    }

    from(date: Date): SearchRequest {
        this._start = date;
        return this;
    }

    to(date: Date): SearchRequest {
        this._end = date;
        return this;
    }

    betweenDates(start: Date, end: Date): SearchRequest {
        this._start = start;
        this._end = end;
        return this;
    }

    point(long: number, lat: number): SearchRequest {
        this._box = undefined;
        this._point = {long, lat};
        return this;
    }

    boundingBox(west: number, north: number, east: number, south: number): SearchRequest {
        this._point = undefined;
        this._box = {west, north, east, south};
        return this;
    }

    setMaximumResolution(res: number|Resolution): SearchRequest {
        this._res = res;
        return this;
    }

    valid(): boolean {
        return !!(this._start && this._res > 0 && (this._point || this._box));
    }

    toQuery(): {[key: string]: string} {
        const query: {[key: string]: string} = {
            start: `${this._start.getFullYear()}-${pad(this._start.getMonth()+1, 2)}-${pad(this._start.getDate(), 2)}`,
            res: this._res.toString(),
        };

        if (this._end) {
            query.end = `${this._end.getFullYear()}-${pad(this._end.getMonth()+1, 2)}-${pad(this._end.getDate(), 2)}`;
        }

        if (this._point) {
            query.lat = this._point.lat.toString();
            query.long = this._point.long.toString();
        }

        if (this._box) {
            query.west = this._box.west.toString();
            query.north = this._box.north.toString();
            query.east = this._box.east.toString();
            query.south = this._box.south.toString();
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

function pad(num: number, size: number): string {
    let numStr = num.toString();
    while (numStr.length < size) numStr = "0" + num;
    return numStr;
}
