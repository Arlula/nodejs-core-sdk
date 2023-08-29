import formatYMDDate from "../util/date";
import { GroundSampleDistance } from "../util/gsd";
import parsePoly, { validWKTPolygon } from "../util/polygon";
/**
 * @class ArchiveSearchRequest constructs a request to search for archival imagery
 * 
 * Searches must specify a target in both space and time;
 *  - Either a target date, or a target date range must be set.
 *  - Similarly a target point or bounding box must be set.
 * 
 * The current validity of the request may be tested with the "valid" method.
 * 
 * @see {https://arlula.com/documentation/#archive-search|Archive Search endpoint documentation}
 */
export default class ArchiveSearchRequest {
    private _start: Date;
    private _end?: Date;
    private _gsd: number = GroundSampleDistance.veryLow;
    private _point?: {long:number,lat:number};
    private _box?: {west: number, north: number, east: number, south: number};
    private _polygon?: number[][][]|string;
    private _supplier?: string;
    private _cloud?: number;
    private _offNadir?: number;
    private _sort?: sortConfig;
    /**
     * Construct a new search request
     * @param {Date} [date] the target date to search
     */
    constructor(date?: Date) {
        this._start = date||new Date();
    }

    /**
     * Search at a target date (removes any previously set end date)
     * @param {Date} date The date to search at
     * @returns {ArchiveSearchRequest} The current request for chaining
     */
    atDate(date: Date): ArchiveSearchRequest {
        this._end = undefined;
        this._start = date;
        return this;
    }

    /**
     * set the starting search date if its changed since the constructor
     * @param {Date} date Target date, or start date for a date range
     * @returns {ArchiveSearchRequest} The current request for chaining
     */
    from(date: Date): ArchiveSearchRequest {
        this._start = date;
        return this;
    }

    /**
     * Set the end date for a date range search
     * @param {Date} date end date of date range
     * @returns {ArchiveSearchRequest} The current request for chaining
     */
    to(date: Date): ArchiveSearchRequest {
        this._end = date;
        return this;
    }

    /**
     * Explicitly sets the date range to search
     * @param {Date} start start date to begin imagery search
     * @param {Date} end end date to stop imagery search
     * @returns {ArchiveSearchRequest} The current request for chaining
     */
    betweenDates(start: Date, end: Date): ArchiveSearchRequest {
        this._start = start;
        this._end = end;
        return this;
    }

    /**
     * search around a target point
     * @param {number} long the longitude of the point
     * @param {number} lat the latitude of the point
     * @returns {ArchiveSearchRequest} The current request for chaining
     */
    point(long: number, lat: number): ArchiveSearchRequest {
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
     * @returns {ArchiveSearchRequest} The current request for chaining 
     */
    boundingBox(west: number, north: number, east: number, south: number): ArchiveSearchRequest {
        this._point = undefined;
        this._polygon = undefined;
        this._box = {west, north, east, south};
        return this;
    }

    /**
     * search with a defined polygon
     * @param {number[][][]} poly the series of loops (list of points) defining your search polygon in longitude, latitude ordering
     * @returns {ArchiveSearchRequest} The current request for chaining 
     */
    polygon(poly: number[][][]|string): ArchiveSearchRequest {
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
     * @returns {ArchiveSearchRequest} The current request for chaining
     */
    setMaximumGSD(gsd: number|GroundSampleDistance): ArchiveSearchRequest {
        this._gsd = gsd;
        return this;
    }

    /**
     * Supplier to restrict results to, must be a match for a valid value of a search results "supplier" field (in any case)
     * 
     * @param {string} supplier supplier key to filter results for
     * @returns {ArchiveSearchRequest} The current request for chaining
     */
    withSupplier(supplier: string): ArchiveSearchRequest {
        this._supplier = supplier;
        return this;
    }

    /**
     * Level of cloud cover to restrict scenes to being less than.
     * 
     * NOTE: must be between 0 and 100%
     * 
     * @param {number} cloud cloud cover percentage to filter results to be less than
     * @returns {ArchiveSearchRequest} The current request for chaining
     */
    withCloudCover(cloud: number): ArchiveSearchRequest {
        this._cloud = cloud;
        return this;
    }

    /**
     * Off Nadir angle (offset angle from directly below the sensor) to get imagery less than.  
     * Values are symmetric, 30 will return results with an angle -30 to 30 if the supplier uses signed off nadir.
     * 
     * NOTE: must be within -45 to 45
     * 
     * @param {number} offNadir offNadir angle to filter results to be less than
     * @returns {ArchiveSearchRequest} The current request for chaining
     */
    withOffNadir(offNadir: number): ArchiveSearchRequest {
        this._offNadir = Math.abs(offNadir);
        return this;
    }

    /**
     * sort results by a given field
     * 
     * Available fields are:
     *  - sceneID => sort by the supplier specific scene IDs alphabetically
     *  - supplier => sort by the supplier identifiers alphabetically
     *  - date => sort by the imagery capture date chronologically
     *  - cloud => sort by the imagery cloud coverage percentage
     *  - offNadir => sort by the imagery's off nadir angle
     *  - gsd => sort by the imagery's ground sampling distance
     *  - area => sort by total scene area
     *  - overlap.area => sort by area overlap with your search aoi
     *  - overlap.percent => sort by percentage overlap with your search aoi
     *  - fulfillment => sort by time for an image order to be fulfilled
     * 
     * A sort by an unrecognized field will be ignored
     * 
     * @param {string} field name of the field to sort by
     * @param {boolean} ascending indicate that the sort should be ascending order
     * @returns {ArchiveSearchRequest} The current request for chaining
     */
    sort(field: string, ascending?: boolean): ArchiveSearchRequest {
        this._sort = {field, ascending};
        return this;
    }

    /**
     * Check whether the request meets the minimum requirements to be valid
     * @returns {boolean} whether the request is currently valid
     */
    valid(): boolean {
        return !!(
            this._start && // when to look
            this._gsd > 0.1 && // how close to look
            (this._point || this._box || (this._polygon && (// where to look
                (Array.isArray(this._polygon) && this._polygon.length > 0) || (typeof this._polygon === "string" && !validWKTPolygon.test(this._polygon)) // polygon valid
            ))) && 
            (!this._cloud || (this._cloud >=0 && this._cloud <= 100)) && // if cloud, valid percentage?
            (!this._offNadir || (this._offNadir >= 0 && this._offNadir <= 45)) // if off-nadir, valid angle?
            );
    }

    /**
     * convert the request into a query string map in preparation for sending
     * 
     * Note: this is for internal use and is not intended for use by end users
     * 
     * @returns {Query Map}
     */
    _toQuery(): {[key: string]: string} {
        const query: {[key: string]: string} = {
            start: formatYMDDate(this._start),
            gsd: this._gsd.toString(),
        };

        if (this._end) {
            query.end = formatYMDDate(this._end);
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

        if (this._polygon) {
            if (Array.isArray(this._polygon)) {
                query.polygon = encodeURIComponent(JSON.stringify(this._polygon));
            } else {
                query.polygon = this._polygon;
            }
        }

        if (this._supplier) {
            query.supplier = this._supplier.toString();
        }

        if (this._cloud) {
            query.cloud = this._cloud.toString();
        }

        if (this._offNadir) {
            query["off-nadir"] = this._offNadir.toString();
        }


        return query;
    }

    /**
     * convert the request into a query string in preparation for sending
     * 
     * Note: this is for internal use and is not intended for use by end users
     * 
     * @returns {string}
     */
    _toQueryString(): string {
        const query = this._toQuery()
        const arr: string[] = [];
        for (const key in query) {
            arr.push(`${key}=${query[key]}`);
        }

        return "?"+arr.join("&")
    }

    _toJSON(): string {
        if (!this.valid) {
            return "";
        }

        // defaults
        const body: searchRequest = {
            startDate: this._start,
            gsd: this._gsd,
            sort: this._sort,
        };

        // geometric constraint
        if (this._point) {
            body.latLong = {
                latitude: this._point.lat,
                longitude: this._point.long,
            };
        }
        if (this._box) {
            body.boundingBox = {
                west: this._box.west,
                south: this._box.south,
                east: this._box.east,
                north: this._box.north,
            };
        }
        if (this._polygon) {
            body.polygon = parsePoly(this._polygon);
        }

        if (this._end) {
            body.endDate = this._end;
        }
        if (this._supplier) {
            body.supplier = this._supplier;
        }
        if (this._cloud) {
            body.cloud = this._cloud;
        }
        if (this._offNadir) {
            body.offNadir = this._offNadir;
        }

        return JSON.stringify(body)
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

    startDate: Date;
    endDate?: Date;
    gsd: number
    supplier?: string;
    cloud?: number;
    offNadir?: number;
    sort?: sortConfig
}

interface sortConfig {
    field: string;
    ascending?: boolean;
}