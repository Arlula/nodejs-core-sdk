import { Asset, BBOX, Link, decodeAsset, decodeBBOX, decodeLink } from "./collection";
import decodePolygon from "../archive/search/polygon";

export default class Item {
    private _type: string;
    private _stacVersion: string;
    private _stacExtensions: string[];
    private _id: string;
    private _crs: string;
    private _geometry: Geometry;
    private _bbox: BBOX;
    private _properties: {[key: string]: unknown};
    private _links: Link[];
    private _assets: {[key: string]: Asset};
    private _collection: string;
    constructor(type: string, version: string, extensions: string[], id: string, crs: string, geometry: Geometry, bbox: BBOX, properties: {[key: string]: unknown}, links: Link[], assets: {[key: string]: Asset}, collection: string) {
        this._type = type;
        this._stacVersion = version;
        this._stacExtensions = extensions;
        this._id = id;
        this._crs = crs;
        this._geometry = geometry;
        this._bbox = bbox;
        this._properties = properties;
        this._links = links;
        this._assets = assets;
        this._collection = collection;
    }

    public get type(): string {
        return this._type;
    }
    public get stacVersion(): string {
        return this._stacVersion;
    }
    public get stacExtensions(): string[] {
        return this._stacExtensions;
    }
    public get id(): string {
        return this._id;
    }
    public get crs(): string {
        return this._crs;
    }
    public get geometry(): Geometry {
        return this._geometry;
    }
    public get bbox(): BBOX {
        return this._bbox;
    }
    public get properties(): {[key: string]: unknown} {
        return this._properties;
    }
    public get links(): Link[] {
        return this._links;
    }
    public get assets(): {[key: string]: Asset} {
        return this._assets;
    }
    public get collection(): string {
        return this._collection;
    }
}

export function decodeItem(json: unknown): Item|null {
    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    let type = "", version = "", id = "", crs = "", collection = "";
    let extensions: string[] = [];
    let geom: Geometry;
    let bbox: BBOX;
    let props: {[key: string]: unknown} = {};
    const links: Link[] = [];
    const assets: {[key: string]: Asset} = {};
    

    // type
    if (argMap?.type && typeof argMap.type == "string") {
        type = argMap.type;
    }
    // stacVersion
    if (argMap?.stac_version && typeof argMap.stac_version == "string") {
        version = argMap.stac_version;
    }
    // stacExtensions
    if (argMap?.stac_extensions && Array.isArray(argMap.stac_extensions)) {
        for (const r in argMap.stac_extensions) {
            if (typeof r !== "string") {
                throw("invalid collection extension, not string");
            }
        }
        extensions = argMap.stac_extensions;
    }
    // id
    if (argMap?.id && typeof argMap.id == "string") {
        id = argMap.id;
    }
    // crs
    if (argMap?.crs && typeof argMap.crs == "string") {
        crs = argMap.crs;
    }
    // geometry
    if (argMap?.geometry) {
        const g = decodeGeometry(argMap.geometry)
        if (!g) {
            throw("invalid collection item geometry");
        }
        geom = g;
    } else {
        throw("");
    }
    // bbox
    if (argMap?.bbox && Array.isArray(argMap.bbox)) {
        const box = decodeBBOX(argMap.bbox);
        if (!box) {
            throw("invalid collection item bounding box");
        }
        bbox = box;
    } else {
        throw("");
    }
    // properties
    if (argMap?.properties && typeof argMap.properties == "object") {
        props = (argMap.properties as {[key: string]: unknown});
    }
    // links
    if (argMap?.links && Array.isArray(argMap.links)) {
        for (let i=0; i<argMap.links.length; i++) {
            const l = decodeLink(argMap.links[i]);
            if (!l) {
                throw("invalid collection item link");
            }
            links.push(l);
        }
    }
    // assets
    if (argMap?.assets && typeof argMap.assets == "object") {
        for (const [key, value] of Object.entries(argMap.assets)) {
            const as = decodeAsset(value);
            if (!as) {
                throw("Error parsing collection item asset: "+key);
            }
            assets[key] = as;
        }
    }
    // collection
    if (argMap?.collection && typeof argMap.collection == "string") {
        collection = argMap.collection;
    }

    return new Item(type, version, extensions, id, crs, geom, bbox, props, links, assets, collection);
}

export class Geometry {
    private _type: string;
    private _coordinates: number[][][];
    constructor(type: string, coordinates: number[][][]) {
        this._type = type;
        this._coordinates = coordinates;
    }

    public get type(): string {
        return this._type;
    }
    public get coordinates(): number[][][] {
        return this._coordinates;
    }
}

export function decodeGeometry(json: unknown): Geometry|null {
    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    let type = "";
    let coords: number[][][] = [];

    // type
    if (argMap?.type && typeof argMap.type == "string") {
        type = argMap.type;
    } else {
        return null;
    }
    // coordinates
    if (argMap?.coordinates && Array.isArray(argMap.coordinates)) {
        const p = decodePolygon(argMap.coordinates);
        if (!p) {
            return null;
        }
        coords = p;
    }

    return new Geometry(type, coords);
}
