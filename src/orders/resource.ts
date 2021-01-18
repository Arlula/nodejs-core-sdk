import { client, request } from "../util/client";
import Response from "../util/response";

export function fromJSON(client: client, json: string|{[key: string]: any}): Resource|string {
    
    if (typeof json === "string") {
        json = JSON.parse(json);
    }

    if (!(json instanceof Object)) {
        return "JSON does not correspond to a Resource object";
    }

    // type check
    if (typeof json.id !== "string") {
        return "No ID for resource";
    }
    if (!(typeof json.createdAt === "string" || json.createdAt instanceof Date)) {
        return "No creation date for resource";
    }
    if (!(typeof json.updatedAt === "string" || json.updatedAt instanceof Date)) {
        return "No update date for resource";
    }
    if (typeof json.order !== "string") {
        return "No order key for resource";
    }
    if (typeof json.name !== "string") {
        return "Resource name missing";
    }
    if (typeof json.type !== "string") {
        return "Resource type missing";
    }
    if (!isResourceType(json.type)) {
        return `Invalid resource type '${json.type}' not recognized`;
    }

    return new Resource(client, json.id, new Date(json.createdAt), new Date(json.updatedAt), json.order, json.name, json.type)
}

export default class Resource {
    private _client: client;
    private _id: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _order: string;
    private _name: string;
    private _type: ResourceType;
    constructor(client: client, id: string, created: Date, updated: Date, order: string, name: string, type: ResourceType) {
        this._client = client;
        this._id = id;
        this._createdAt = created;
        this._updatedAt = updated;
        this._order = order;
        this._name = name;
        this._type = type;
    }

    // public getters

    public get id(): string {
        return this._id;
    }
    public get createdAt(): Date {
        return this._createdAt;
    }
    public get updatedAt(): Date {
        return this._updatedAt;
    }
    public get order(): string {
        return this._order;
    }
    public get name(): string {
        return this._name;
    }
    public get type(): ResourceType {
        return this._type;
    }

    // actual functions

    download(): Promise<string> {
        return downloadHelper(this._client, this._id);
    }
}

const downloadPath = "/api/orders/resource/download";

export function downloadHelper(client: client, id: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = new request(downloadPath);
        req.addParam("id", id);
        client.do(req)
        .then((resp) => {
            if (!resp.ok()) {
                reject(resp.text());
            }

            resolve(resp.text());
        })
        .catch(reject)
    });
}

export enum ResourceType {
    ImageryTiff       = "img_tiff",
    ImageryJP2        = "img_jp2",
    Thumb             = "thumb",
    Overview          = "gdal_tiff_overview",
    MetadataMTL       = "meta_mtl",
    MetadataJSON      = "meta_json",
    MetadataXML       = "meta_xml",
    MetadataBundle    = "meta_bundle",
    GeometryJSON      = "geo_json",
    GeometryKml       = "geo_kml",
    GeometryShapefile = "geo_shp",
    GeometryBundle    = "geo_bundle",
    License           = "license",
}

function isResourceType(token: any): token is ResourceType {
    return Object.values(ResourceType).includes(token as ResourceType);
};
