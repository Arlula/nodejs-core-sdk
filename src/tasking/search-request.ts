import parsePoly, { validWKTPolygon } from "../util/polygon";
import { GroundSampleDistance } from "../util/gsd";

/**
 * @class TaskingSearchRequest constructs a request to search for tasking opportunities
 * 
 * Searches must specify a target in both space and time;
 *  - Either a target date, or a target date range must be set.
 *  - Similarly a target point or bounding box must be set.
 * 
 * The current validity of the request may be tested with the "valid" method.
 * 
 * @see {https://arlula.com/documentation/#tasking-search|Tasking Search endpoint documentation}
 */
export default class TaskingSearchRequest {
    // geographic interest
    private _point?: {long:number,lat:number};
    private _box?: {west: number, north: number, east: number, south: number};
    private _polygon?: number[][][]|string;
    // temporal interest
    private _start?: Date;
    private _end?: Date;
    // specifiers
    private _offNadir?: number;
    private _gsd?: number;
    private _suppliers?: string[];
    private _sort?: sortConfig;
    constructor(start?: Date, end?: Date) {
        if (start) {
            this._start = start;
        }
        if (end) {
            this._end = end;
        }
    }

    
    /**
     * set the starting search date if its changed since the constructor
     * @param {Date} date Target date, or start date for a date range
     * @returns {TaskingSearchRequest} The current request for chaining
     */
    from(date: Date): TaskingSearchRequest {
        this._start = date;
        return this;
    }

    /**
     * Set the end date for a date range search
     * @param {Date} date end date of date range
     * @returns {TaskingSearchRequest} The current request for chaining
     */
    to(date: Date): TaskingSearchRequest {
        this._end = date;
        return this;
    }

    /**
     * Explicitly sets the date range to search
     * @param {Date} start start date to begin imagery search
     * @param {Date} end end date to stop imagery search
     * @returns {TaskingSearchRequest} The current request for chaining
     */
    betweenDates(start: Date, end: Date): TaskingSearchRequest {
        this._start = start;
        this._end = end;
        return this;
    }

    /**
     * search around a target point
     * @param {number} long the longitude of the point
     * @param {number} lat the latitude of the point
     * @returns {TaskingSearchRequest} The current request for chaining
     */
    point(long: number, lat: number): TaskingSearchRequest {
        this._box = undefined;
        this._polygon = undefined;
        this._point = {long, lat};
        return this;
    }

    /**
     * search within a bounding box
     * @param {number} west   the western boundary of the box
     * @param {number} north  the northern boundary of the box
     * @param {number} east   the eastern boundary of the box
     * @param {number} south  the southern boundary of the box
     * @returns {TaskingSearchRequest} The current request for chaining 
     */
    boundingBox(west: number, north: number, east: number, south: number): TaskingSearchRequest {
        this._point = undefined;
        this._polygon = undefined;
        this._box = {west, north, east, south};
        return this;
    }

    /**
     * search with a defined polygon
     * @param {number[][][]} poly the series of loops (list of points) defining your search polygon in longitude, latitude ordering
     * @returns {TaskingSearchRequest} The current request for chaining 
     */
    polygon(poly: number[][][]|string): TaskingSearchRequest {
        this._point = undefined;
        this._box = undefined;
        this._polygon = poly
        return this;
    }

    /**
     * Set the maximum ground sample distance that will be returned by a search
     * Search either by a specified gsd in m/pixel or using one of
     * the predefined GroundSampleDistance labels
     * 
     * NOTE: a minimum search of 0.1m/pixel is accepted, lower sample distances are less likely to return as many, or any results
     * 
     * @param {number|GroundSampleDistance} gsd the sample distance to limit the result set to
     * @returns {TaskingSearchRequest} The current request for chaining
     */
    setMaximumGSD(gsd: number|GroundSampleDistance): TaskingSearchRequest {
        this._gsd = gsd;
        return this;
    }

    /**
     * Supplier list to restrict results to, entries must be a match for a valid value of a search results "supplier" field (in any case)
     * 
     * @param {string[]} suppliers list of supplier keys to filter results for
     * @returns {TaskingSearchRequest} The current request for chaining
     */
    withSuppliers(suppliers: string[]): TaskingSearchRequest {
        this._suppliers = suppliers;
        return this;
    }

    /**
     * Supplier to add to the restrictions on results, must be a match for a valid value of a search results "supplier" field (in any case)
     * 
     * @param {string} supplier supplier key to add to result filters
     * @returns {TaskingSearchRequest} The current request for chaining
     */
    addSupplier(supplier: string): TaskingSearchRequest {
        this._suppliers?.push(supplier);
        return this;
    }

    /**
     * Off Nadir angle (offset angle from directly below the sensor) to get imagery less than.  
     * Values are symmetric, 30 will return results with an angle -30 to 30 if the supplier uses signed off nadir.
     * 
     * NOTE: must be within -45 to 45
     * 
     * @param {number} offNadir offNadir angle to filter results to be less than
     * @returns {TaskingSearchRequest} The current request for chaining
     */
    withOffNadir(offNadir: number): TaskingSearchRequest {
        this._offNadir = Math.abs(offNadir);
        return this;
    }

    /**
     * sort results by a given field
     * 
     * Available fields are:
     *  - supplier => sort by the supplier identifiers alphabetically
     *  - duration => sort by the total time length of the capture opportunity
     *  - start => sort by the start date of the capture window
     *  - end => sort by the end date of the capture window
     *  - maxOffNadir => sort by the maximum predicted off nadir angle
     *  - gsd => sort by the platforms's nominal ground sampling distance
     *  - areas.scene => sort by the total area of the scene to be captured
     *  - areas.target => sort by the target area the capture will target to ensure inclusion
     * 
     * A sort by an unrecognized field will be ignored
     * 
     * @param {string} field name of the field to sort by
     * @param {boolean} ascending indicate that the sort should be ascending order
     * @returns {TaskingSearchRequest} The current request for chaining
     */
    sort(field: string, ascending?: boolean): TaskingSearchRequest {
        this._sort = {field, ascending};
        return this;
    }

    valid(): boolean {
        if (!this._start) {
            return false;
        }
        if (!this._end) {
            return false;
        }
        if (this._start > this._end) {
            return false;
        }
        if (!(this._point || this._box || this._polygon)) {
            return false;
        }
        if (this._polygon && !((Array.isArray(this._polygon) && this._polygon.length > 0) || (typeof this._polygon === "string" && !validWKTPolygon.test(this._polygon)))) {
            return false;
        }

        if (this._offNadir && Math.abs(this._offNadir) > 60) {
            return false;
        }
        if (this._gsd && (this._gsd > 1000 || this._gsd < 0.1)) {
            return false;
        }

        return true;
    }

    _toJSON(): string {
        if (!this.valid()) {
            return "";
        }

        const body: searchRequest = {
            start:     this._start,
            end:       this._end,
            gsd:       this._gsd,
            suppliers: this._suppliers,
            offNadir:  this._offNadir,
            sort: this._sort,
        };

        if (this._point) {
            body.latLong = {longitude: this._point.long, latitude: this._point.lat};
        }
        if (this._box) {
            body.boundingBox = this._box;
        }
        if (this._polygon) {
            body.polygon = parsePoly(this._polygon);
        }

        return JSON.stringify(body);
    }

}


interface searchRequest {
    latLong?: {
        latitude: number;
        longitude: number;
    };
    boundingBox?: {
        west: number;
        south: number;
        east: number;
        north: number;
    };
    polygon?: number[][][];

    start?: Date;
    end?: Date;
    gsd?: number
    suppliers?: string[];
    offNadir?: number;
    sort?: sortConfig;
}

interface sortConfig {
    field: string;
    ascending?: boolean;
}
