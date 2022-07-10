import Band, { decodeBand } from "./band";
import Center, { decodeCenter } from "./center";
import Overlap, { decodeOverlap } from "./overlap";
import BundleOption, { decodeBundle } from "./bundle";
import License, { decodeLicense } from "./license";
import decodePolygon from "./polygon";

/**
 * SearchResult contains information on a scene that may be ordered through the archive API
 * full details can be found in the Arlula Documentation
 * 
 * @see {https://arlula.com/documentation/#archive-search|Archive Search endpoint documentation}
 * or
 * @see {https://arlula.com/documentation/#ref-search-result|Archive Search result structure reference}
 */
export default class SearchResult {
    sceneID: string;
    supplier: string;
    platform: string;
    date: Date;
    thumbnail: string;
    cloud: number;
    offNadir: number;
    gsd: number;
    bands: Band[];
    area: number;
    center: Center;
    bounding: number[][][];
    overlap: Overlap;
    fulfillmentTime: number;
    orderingID: string;
    bundles: BundleOption[];
    license: License[];
    annotations: string[];
    constructor(
        sceneID: string,
        supplier: string,
        platform: string,
        date: Date,
        thumbnail: string,
        cloud: number,
        offNadir: number,
        gsd: number,
        bands: Band[],
        area: number,
        center: Center,
        bounding: number[][][],
        overlap: Overlap,
        fulfillmentTime: number,
        orderingID: string,
        bundles: BundleOption[],
        license: License[],
        annotations: string[]
    ) {
        this.sceneID = sceneID;
        this.supplier = supplier;
        this.platform = platform;
        this.date = date;
        this.thumbnail = thumbnail;
        this.cloud = cloud;
        this.offNadir = offNadir;
        this.gsd = gsd;
        this.bands = bands;
        this.area = area;
        this.center = center;
        this.bounding = bounding;
        this.overlap = overlap;
        this.fulfillmentTime = fulfillmentTime;
        this.orderingID = orderingID;
        this.bundles = bundles;
        this.license = license;
        this.annotations = annotations;
    }

    // calculates the price of the order if ordered with the given bundle key and license url
    // price is returned in US cents.
    // If the bundle key or license are not valid for this result, -1 is returned.
    calculatePrice(bundleKey: string, licenseURL: string): number {
        let bundle: BundleOption|undefined;
        let license: License|undefined;
        for (let i=0; i<this.bundles.length; i++) {
            if (this.bundles[i].key == bundleKey) {
                bundle = this.bundles[i];
                break;
            }
        }
        for (let i=0; i<this.license.length; i++) {
            if (this.license[i].href == licenseURL) {
                license = this.license[i];
                break;
            }
        }

        if (!bundle || !license) {
            return -1;
        }

        return license.loadPrice(bundle.price);
    }
}

// decodeResult is a helper for reading results from JSON, it is not intended for public use.
export function decodeResult(json: unknown): SearchResult|null {
    let sceneID = "", supplier = "", platform = "", thumbnail = "", orderingID = "";
    let date: Date = new Date();
    let cloud = 0, offNadir = 0, gsd = 0, area = 0, fulfillmentTime = 0;
    const bands: Band[] = [];

    let center: Center = {lat: 0, long: 0};
    let bounding: number[][][] = [];
    let overlap: Overlap = {area: 0, percent: {scene: 0}, polygon: []};
    const bundles: BundleOption[] = [];
    const license: License[] = [];
    const annotations: string[] = [];

    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    // sceneID
    if (argMap?.sceneID && typeof argMap.sceneID == "string") {
        sceneID = argMap.sceneID;
    } else {
        return null;
    }
    // supplier
    if (argMap?.supplier && typeof argMap.supplier == "string") {
        supplier = argMap.supplier;
    } else {
        return null;
    }
    // platform
    if (argMap?.platform && typeof argMap.platform == "string") {
        platform = argMap.platform;
    } else {
        return null;
    }
    // date
    if (argMap?.date && typeof argMap.date == "string") {
        date = new Date(argMap.date);
    } else {
        return null;
    }
    // thumbnail
    if (argMap?.thumbnail && typeof argMap.thumbnail == "string") {
        thumbnail = argMap.thumbnail;
    } else {
        return null;
    }
    // cloud
    if (argMap?.cloud !== undefined && typeof argMap.cloud == "number") {
        cloud = argMap.cloud;
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
    } else if (argMap?.resolution && typeof argMap.resolution == "number") {
        gsd = argMap.resolution;
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
    // area
    if (argMap?.area && typeof argMap.area == "number") {
        area = argMap.area;
    } else {
        return null;
    }
    // center
    if (argMap?.center && typeof argMap.center == "object") {
        const c = decodeCenter(argMap.center);
        if (!c) {
            return null
        }
        center = c;
    } else {
        return null;
    }
    // bounding
    if (argMap?.bounding && Array.isArray(argMap.bounding)) {
        const p = decodePolygon(argMap.bounding);
        if (!p) {
            return null;
        }
        bounding = p;
    } else {
        return null;
    }
    // overlap
    if (argMap?.overlap && typeof argMap.overlap == "object") {
        const o = decodeOverlap(argMap.overlap);
        if (!o) {
            return null;
        }
        overlap = o;
    } else {
        return null;
    }
    // fulfillmentTime
    if (argMap?.fulfillmentTime !== undefined && typeof argMap.fulfillmentTime == "number") {
        fulfillmentTime = argMap.fulfillmentTime;
    } else {
        return null;
    }
    // orderingID
    if (argMap?.orderingID && typeof argMap.orderingID == "string") {
        orderingID = argMap.orderingID;
    } else if (argMap?.id && typeof argMap.id == "string") {
        orderingID = argMap.id;
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
    // license
    if (argMap?.license && Array.isArray(argMap.license)) {
        argMap.license.forEach((b) => {
            const li = decodeLicense(b);
            if (li) {
                license.push(li);
            } else {
                return null;
            }
        });
    }
    // annotations
    if (argMap?.annotations && Array.isArray(argMap.annotations)) {
        argMap.annotations.forEach((a) => {
            if (typeof a == "string") {
                annotations.push(a);
            } else {
                return null;
            }
        });
    }


    return new SearchResult(
        sceneID,
        supplier,
        platform,
        date,
        thumbnail,
        cloud,
        offNadir,
        gsd,
        bands,
        area,
        center,
        bounding,
        overlap,
        fulfillmentTime,
        orderingID,
        bundles,
        license,
        annotations,
    );
}
