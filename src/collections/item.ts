import { Asset, BBOX, Link } from "./collection";

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
