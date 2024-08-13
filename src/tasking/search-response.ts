import Band from "../archive/search/band";
import BundleOption from "../archive/search/bundle";
import License from "../archive/search/license";
import { decodeBand } from "../archive/search/band";
import decodePolygon from "../archive/search/polygon";
import { decodeBundle } from "../archive/search/bundle";
import { decodeLicense } from "../archive/search/license";
import { Priority, decodePriority } from "./priority";
import { CloudLevel, decodeCloudLevel } from "./cloud";

/**
 * TaskingSearchResponse is a response envelope that includes the search result set
 * This envelope will be expanded in coming updates
 * 
 * @see {https://arlula.com/documentation/#tasking-search|Tasking Search endpoint documentation}
 * or
 * @see {https://arlula.com/documentation/#search-response|Tasking Search Response}
 */
export interface TaskingSearchResponse {
    // status: string;
    errors?: annotation[];
    // warnings: string[];
    results?:  TaskingSearchResult[];
    failures?: taskingFailure[];
}


export interface annotation {
    message:    string;
    supplier:   string;
    platforms?: string[];
}

export interface taskingFailure {
    type:      string;
    message:   string;
    supplier:  string;
    platforms: string[];
    detail:    any;
}

export function isResponse(object: unknown): object is TaskingSearchResponse {
    return !!object && (typeof object === "object") && ('errors' in object || 'results' in object || 'failures' in object);
}

// decodeResponse is a helper for reading results from JSON, it is not intended for public use.
export function decodeResponse(json: unknown): TaskingSearchResponse|null {
    let results: TaskingSearchResult[];

    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    if (argMap?.results && Array.isArray(argMap.results)) {
        const r = decodeResultSet(argMap.results);
        if (!r) {
            return null;
        }
        results = r;
    } else {
        return null;
    }

    return {results};
}

// decodeResultSet is a helper for reading results from JSON, it is not intended for public use.
export function decodeResultSet(json: unknown[]): TaskingSearchResult[]|null {
    const results: TaskingSearchResult[] = [];

    let error = false
    json.forEach((b) => {
        const r = decodeResult(b);
        if (r) {
            results.push(r);
        } else {
            error = true;
        }
    });
    if (error) {
        return null
    }

    return results;
}

/**
 * SearchResult contains information on a capture opportunity that may be ordered through the tasking API
 * full details can be found in the Arlula Documentation
 * 
 * @see {https://arlula.com/documentation/#tasking-search|Tasking Search endpoint documentation}
 * or
 * @see {https://arlula.com/documentation/#ref-search-result|Tasking Search result structure reference}
 */
export class TaskingSearchResult {
    polygon: number[][][];
    startDate: Date;
    endDate: Date;
    metrics: taskingMetrics;
    gsd: number;
    supplier: string;
    orderingID: string;
    offNadir: number;
    bands: Band[];
    bundles: BundleOption[];
    licenses: License[];
    priorities: Priority[];
    cloud: CloudLevel[];
    platforms: string[];
    annotations?: annotation[];
    constructor(
        polygon: number[][][],
        startDate: Date,
        endDate: Date,
        metrics: taskingMetrics,
        gsd: number,
        supplier: string,
        orderingID: string,
        offNadir: number,
        bands: Band[],
        bundles: BundleOption[],
        licenses: License[],
        priorities: Priority[],
        cloud: CloudLevel[],
        platforms: string[],
        annotations?: annotation[],
    ) {
        this.polygon = polygon;
        this.metrics = metrics;
        this.startDate = startDate;
        this.endDate = endDate;
        this.gsd = gsd;
        this.supplier = supplier;
        this.orderingID = orderingID;
        this.offNadir = offNadir;
        this.bands = bands;
        this.bundles = bundles;
        this.licenses = licenses;
        this.priorities = priorities;
        this.cloud = cloud;
        this.platforms = platforms;
        this.annotations = annotations;
    }
}

export interface taskingMetrics {
    windowsAvailable: number;
    windowsRequired:  number;
    orderArea:        number;
    moq:              number;
}


// decodeResult is a helper for reading results from JSON, it is not intended for public use.
export function decodeResult(json: unknown): TaskingSearchResult|null {
    let polygon: number[][][] = [];
    const metrics: taskingMetrics = {windowsAvailable: 0, windowsRequired: 0, orderArea: 0, moq: 0,};
    let startDate = new Date(), endDate = new Date();
    let supplier = "", orderingID = "";
    let offNadir = 0, gsd = 0;
    const bands: Band[] = [];
    const bundles: BundleOption[] = [];
    const licenses: License[] = [];
    const priorities: Priority[] = [];
    const clouds: CloudLevel[] = [];
    const platforms: string[] = [];
    const annotations: annotation[] = [];

    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    // supplier
    if (argMap?.supplier && typeof argMap.supplier == "string") {
        supplier = argMap.supplier;
    } else {
        return null;
    }
    // platforms
    if (argMap?.platforms && Array.isArray(argMap.platforms)) {
        for (let i=0; i<argMap.platforms.length; i++) {
            if (typeof argMap.platforms[i] == "string") {
                platforms.push(argMap.platforms[i]);
            } else {
                return null;
            }
        }
    } else {
        return null;
    }
    // startDate
    if (argMap?.startDate && typeof argMap.startDate == "string") {
        startDate = new Date(argMap.startDate);
    } else {
        return null;
    }
    // endDate
    if (argMap?.endDate && typeof argMap.endDate == "string") {
        endDate = new Date(argMap.endDate);
    } else {
        return null;
    }
    // offNadir
    if (argMap?.offNadir !== undefined && typeof argMap.offNadir == "number") {
        offNadir = argMap.offNadir;
    } else {
        return null;
    }
    // gsd
    if (argMap?.gsd && typeof argMap.gsd == "number") {
        gsd = argMap.gsd;
    } else {
        return null;
    }
    // bands
    if (argMap?.bands && Array.isArray(argMap.bands)) {
        argMap.bands.forEach((b) => {
            const band = decodeBand(b);
            if (band) {
                bands.push(band);
            } else {
                return null;
            }
        });
    }
    // metrics
    if (argMap?.metrics && typeof argMap.metrics == "object") {
        const innerMap = argMap.metrics as {[key: string]: unknown};
        if (innerMap?.windowsAvailable && typeof innerMap.windowsAvailable == "number") {
            metrics.windowsAvailable = innerMap.windowsAvailable;
        }
        if (innerMap?.windowsRequired && typeof innerMap.windowsRequired == "number") {
            metrics.windowsRequired = innerMap.windowsRequired;
        }
        if (innerMap?.orderArea && typeof innerMap.orderArea == "number") {
            metrics.orderArea = innerMap.orderArea;
        }
        if (innerMap?.moq && typeof innerMap.moq == "number") {
            metrics.moq = innerMap.moq;
        }
    } else {
        return null;
    }
    // polygons
    if (argMap?.polygons && Array.isArray(argMap.polygons)) {
        const p = decodePolygon(argMap.polygons);
        if (!p) {
            return null;
        }
        polygon = p;
    } else {
        return null;
    }
    // orderingID
    if (argMap?.orderingID && typeof argMap.orderingID == "string") {
        orderingID = argMap.orderingID;
    } else {
        return null;
    }
    // bundles
    if (argMap?.bundles && Array.isArray(argMap.bundles)) {
        argMap.bundles.forEach((b) => {
            const bundle = decodeBundle(b);
            if (bundle) {
                bundles.push(bundle);
            } else {
                return null;
            }
        });
    }
    // licenses
    if (argMap?.licenses && Array.isArray(argMap.licenses)) {
        argMap.licenses.forEach((b) => {
            const li = decodeLicense(b);
            if (li) {
                licenses.push(li);
            } else {
                return null;
            }
        });
    }
    // priorities
    if (argMap?.priorities && Array.isArray(argMap.priorities)) {
        argMap.priorities.forEach((b) => {
            const li = decodePriority(b);
            if (li) {
                priorities.push(li);
            } else {
                return null;
            }
        });
    }
    // cloud levels
    if (argMap?.cloud && Array.isArray(argMap.cloud)) {
        argMap.cloud.forEach((b) => {
            const li = decodeCloudLevel(b);
            if (li) {
                clouds.push(li);
            } else {
                return null;
            }
        });
    }
    // annotations
    if (argMap?.annotations && Array.isArray(argMap.annotations)) {
        argMap.annotations.forEach((a) => {
            if (typeof a == "object") {
                const inner = a as {[key: string]: unknown};
                const ann: annotation = {message: "", supplier: ""};
                if (inner?.message && typeof inner.message == "string") {
                    ann.message = inner.message;
                }
                if (inner?.supplier && typeof inner.supplier == "string") {
                    ann.supplier = inner.supplier;
                }
                if (inner?.platforms && Array.isArray(inner.supplier)) {
                    ann.platforms = inner.platforms as string[];
                }

                annotations.push(ann);
            } else {
                return null;
            }
        });
    }


    return new TaskingSearchResult(
        polygon,
        startDate,
        endDate,
        metrics,
        gsd,
        supplier,
        orderingID,
        offNadir,
        bands,
        bundles,
        licenses,
        priorities,
        clouds,
        platforms,
        annotations,
    );
}
