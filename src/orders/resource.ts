import fs, { WriteStream } from "fs";
import paths from "../util/paths";
import { requestBuilder, bufferOrError } from "../util/request";

/**
 * Utility class to construct Resources from JSON data
 * 
 * Note: only to be used internally, not by end users
 * @param {requestBuilder} client the dialer 
 * @param json the JSON content to attempt to parse into a Resource
 */
export function fromJSON(client: requestBuilder, json: string|{[key: string]: unknown}): Resource|string {
    
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
    if (typeof json.dataset !== "string") {
        return "No dataset key for resource";
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
    if (typeof json.size !== "number") {
        return "Resource size missing";
    }
    if (typeof json.format !== "string") {
        return "Resource format missing";
    }
    if (!json.roles || !Array.isArray(json.roles)) {
        return "Resource roles missing";
    }
    if (typeof json.checksum !== "string") {
        return "Resource checksum missing";
    }

    return new Resource(client, json.id, new Date(json.createdAt), new Date(json.updatedAt), json.dataset, json.name, json.type, json.size, json.format, json.roles, json.checksum)
}

/**
 * @class Resource wraps the data that represents a dataset resource
 * 
 * Note: construction of this class is to only be done internally to the library
 * 
 * @see {https://arlula.com/documentation/#ref-resource|Dataset Resource structure reference}
 */
export default class Resource {
    private _client: requestBuilder;
    private _id: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _dataset: string;
    private _name: string;
    private _type: ResourceType;
    private _size: number;
    private _format: string;
    private _roles: string[];
    private _checksum: string;
    /**
     * create a new resource instance
     * @constructor
     * 
     * @param {requestBuilder} client  The initiated http transport for the API, created and initialized with credentials by the root Arlula client
     * @param {string}        id      The Resource ID
     * @param {Date}          created The timestamp when the resource was created (UTC timezone)
     * @param {Date}          updated The timestamp when the resource was last updated (UTC timezone)
     * @param {string}        dataset   ID of the dataset this resource belongs to
     * @param {string}        name    An identifiable name/filename for this resource
     * @param {ResourceType}  type    Identifier for the type of resource (imagery, metadata, etc @see ResourceType )
     */
    constructor(client: requestBuilder, id: string, created: Date, updated: Date, dataset: string, name: string, type: ResourceType, size: number, format: string, roles: string[], checksum: string) {
        this._client = client;
        this._id = id;
        this._createdAt = created;
        this._updatedAt = updated;
        this._dataset = dataset;
        this._name = name;
        this._type = type;
        this._size = size;
        this._format = format;
        this._roles = roles;
        this._checksum = checksum;
    }

     // public getters
    // provides an interface to get resource fields, without providing a setter interface
    // functionally ready only publicly, but allow edit internally

    public get id(): string {
        return this._id;
    }
    public get createdAt(): Date {
        return this._createdAt;
    }
    public get updatedAt(): Date {
        return this._updatedAt;
    }
    public get dataset(): string {
        return this._dataset;
    }
    public get name(): string {
        return this._name;
    }
    /**
     * @deprecated legacy `resource.type` is deprecated
     * field will be provided for datasets during transition.
     * 
     * roles field is the recommended replacement, see
     * @see {https://arlula.com/documentation/#ref-resource|Dataset Resource structure reference} 
     * and the "resource roles" section for details on the new role field and its use.
     */
    public get type(): ResourceType {
        return this._type;
    }
    public get size(): number {
        return this._size;
    }
    public get format(): string {
        return this._format;
    }
    public get roles(): string[] {
        return this._roles;
    }
    public get checksum(): string {
        return this._checksum;
    }

    // actual functions

    /**
     * Download the content of a resource (imagery, metadata, etc)
     * Data is made available as an ArrayBuffer.
     * 
     * Note: If the dataset this resource is for has its `expiration` field set and that date has
     * passed, this request will fail as the resource has expired and is no longer hosted in the platform
     * 
     * @returns {Promise<ArrayBuffer>} the content of the resource as a Buffer
     */
    download(): Promise<ArrayBuffer> {
        return downloadHelper(this._client, this._id);
    }

    /**
     * Download the content of a resource (imagery, metadata, etc)
     * Data is piped into the provided fs.WriteStream or one is created at the provided filepath.
     * 
     * Note: If the dataset this resource is for has its `expiration` field set and that date has
     * passed, this request will fail as the resource has expired and is no longer hosted in the platform
     * 
     * @returns {Promise<WriteStream>} file the resource was written to
     */
    downloadToFile(ref: string|WriteStream): Promise<WriteStream> {
        return downloadFileHelper(this._client, this._id, ref);
    }
}

/**
 * helper function to allow the download call both form a resource and from the orders API client
 * 
 * Note: an internal helper not intended to be called directly
 * 
 * @param {requestBuilder} client The initiated http transport for the API, created and initialized with credentials by the root Arlula client
 * @param {string}        id     ID of the resource to download
 */
export function downloadHelper(client: requestBuilder, id: string): Promise<ArrayBuffer> {
    return client("GET", paths.ResourceDownload(id))
    .then((r) => {
        const redirect = r.headers.get("location");
        if (!redirect) {
            return r;
        }
        return client("GET", redirect, undefined, undefined, true);
    })
    .then(bufferOrError);
}

/**
 * helper function to allow the download call both form a resource and from the orders API client
 * resources downloaded through this helper are piped into a file rather than an in memory buffer.
 * 
 * Note: an internal helper not intended to be called directly
 * 
 * @param {requestBuilder} client The initiated http transport for the API, created and initialized with credentials by the root Arlula client
 * @param {string}        id     ID of the resource to download
 * @param {string|fs.WriteStream} fileRef File stream or path at which to create the file that the resource will be downloaded to
 */
export function downloadFileHelper(client: requestBuilder, id: string, fileRef: string|WriteStream): Promise<WriteStream> {
    return new Promise((resolve, reject) => {
        let file: WriteStream;
        if (typeof fileRef === "string") {
            file = fs.createWriteStream(fileRef, { 
                flags: "w+",
                mode: 0o644,
            });
        } else {
            file = fileRef;
        }

        client("GET", paths.ResourceDownload(id))
        .then((r) => {
            const redirect = r.headers.get("location");
            if (!redirect) {
                return r;
            }
            return client("GET", redirect, undefined, undefined, true);
        })
        .then((res) => {
            res.body?.pipe(file);
            res.body?.on("error", (e) => {
                reject(e)
            });
            file.on("finish", () => {
                resolve(file);
            });
        });
    });
}

/**
 * ResourceType enumerates the currently provided/supported list of resources the Arlula API provides
 * 
 * << imagery types >>
 * ImageryTiff -------> "img_tiff",
 * ImageryJP2 --------> "img_jp2",
 * Thumb -------------> "thumb",
 * 
 * << metadata types >>
 * Overview ----------> "gdal_tiff_overview",
 * MetadataMTL -------> "meta_mtl",
 * MetadataJSON ------> "meta_json",
 * MetadataXML -------> "meta_xml",
 * MetadataBundle ----> "meta_bundle",
 * 
 * << geometry types >>
 * GeometryJSON ------> "geo_json",
 * GeometryKml -------> "geo_kml",
 * GeometryShapefile -> "geo_shp",
 * GeometryBundle ----> "geo_bundle",
 * 
 * << license information >>
 * License -----------> "license",
 */
export enum ResourceType {
    ImageryTiff       = "img_tif",
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

function isResourceType(token: string): token is ResourceType {
    return Object.values(ResourceType).includes(token as ResourceType);
}
