import Band from "../archive/search/band";
import BundleOption from "../archive/search/bundle";
import License from "../archive/search/license";
import { decodeBand } from "../archive/search/band";
import { decodeMultiPolygon } from "../archive/search/polygon";
import { decodeBundle } from "../archive/search/bundle";
import { decodeLicense } from "../archive/search/license";

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
    results?: TaskingSearchResult[];
}


export interface annotation {
    message:    string;
    supplier:   string;
    platforms?: string[];
}

export function isResponse(object: unknown): object is TaskingSearchResponse {
    return !!object && (typeof object === "object") && ('errors' in object || 'results' in object);
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
    polygons: number[][][][];
    areas: taskingArea;
    startDate: Date;
    endDate: Date;
    gsd: number;
    supplier: string;
    orderingID: string;
    offNadir: number;
    bands: Band[];
    bundles: BundleOption[];
    licenses: License[];
    platforms: string[];
    annotations?: annotation[];
    constructor(
        polygons: number[][][][],
        areas: taskingArea,
        startDate: Date,
        endDate: Date,
        gsd: number,
        supplier: string,
        orderingID: string,
        offNadir: number,
        bands: Band[],
        bundles: BundleOption[],
        licenses: License[],
        platforms: string[],
        annotations?: annotation[],
    ) {
        this.polygons = polygons;
        this.areas = areas;
        this.startDate = startDate;
        this.endDate = endDate;
        this.gsd = gsd;
        this.supplier = supplier;
        this.orderingID = orderingID;
        this.offNadir = offNadir;
        this.bands = bands;
        this.bundles = bundles;
        this.licenses = licenses;
        this.platforms = platforms;
        this.annotations = annotations;
    }
}

export interface taskingArea {
    target: number;
    scene: number;
}


// decodeResult is a helper for reading results from JSON, it is not intended for public use.
export function decodeResult(json: unknown): TaskingSearchResult|null {
    let polygons: number[][][][] = [];
    const areas: taskingArea = {target: 0, scene: 0};
    let startDate = new Date(), endDate = new Date();
    let supplier = "", orderingID = "";
    let offNadir = 0, gsd = 0;
    const bands: Band[] = [];
    const bundles: BundleOption[] = [];
    const licenses: License[] = [];
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
    // areas
    if (argMap?.areas && typeof argMap.areas == "object") {
        const innerMap = argMap.areas as {[key: string]: unknown}
        if (innerMap?.target && typeof innerMap.target == "number") {
            areas.target = innerMap.target;
        }
        if (innerMap?.scene && typeof innerMap.scene == "number") {
            areas.scene = innerMap.scene;
        }
    } else {
        return null;
    }
    // polygons
    if (argMap?.polygons && Array.isArray(argMap.polygons)) {
        const p = decodeMultiPolygon(argMap.polygons);
        if (!p) {
            return null;
        }
        polygons = p;
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
        polygons,
        areas,
        startDate,
        endDate,
        gsd,
        supplier,
        orderingID,
        offNadir,
        bands,
        bundles,
        licenses,
        platforms,
        annotations,
    );
}
