/// <reference types="node" />
import { AxiosInstance } from "axios";
/**
 * Utility class to construct Resources from JSON data
 *
 * Note: only to be used internally, not by end users
 * @param {AxiosInstance} client the dialer
 * @param json the JSON content to attempt to parse into a Resource
 */
export declare function fromJSON(client: AxiosInstance, json: string | {
    [key: string]: unknown;
}): Resource | string;
/**
 * @class Resource wraps the data that represents an order resource
 *
 * Note: construction of this class is to only be done internally to the library
 */
export default class Resource {
    private _client;
    private _id;
    private _createdAt;
    private _updatedAt;
    private _order;
    private _name;
    private _type;
    /**
     * create a new resource instance
     * @constructor
     *
     * @param {AxiosInstance} client  The initiated http transport for the API, created and initialized with credentials by the root Arlula client
     * @param {string}        id      The Resource ID
     * @param {Date}          created The timestamp when the resource was created (UTC timezone)
     * @param {Date}          updated The timestamp when the resource was last updated (UTC timezone)
     * @param {string}        order   ID of the order this resource belongs to
     * @param {string}        name    An identifiable name/filename for this resource
     * @param {ResourceType}  type    Identifier for the type of resource (imagery, metadata, etc @see ResourceType )
     */
    constructor(client: AxiosInstance, id: string, created: Date, updated: Date, order: string, name: string, type: ResourceType);
    get id(): string;
    get createdAt(): Date;
    get updatedAt(): Date;
    get order(): string;
    get name(): string;
    get type(): ResourceType;
    /**
     * Download the content of a resource (imagery, metadata, etc)
     * Data is made available as an ArrayBuffer or Buffer depending upon platform.
     *
     * Note: If the order this resource is for has its `expiration` field set and that date has
     * passed, this request will fail as the resource has expired and is no longer hosted in the platform
     *
     * @returns {Promise<ArrayBuffer|Buffer>} the content of the resource as a Buffer
     */
    download(): Promise<ArrayBuffer | Buffer>;
}
/**
 * helper function to allow the download call both form a resource and from the orders API client
 *
 * Note: an internal helper not intended to be called directly
 *
 * @param {AxiosInstance} client The initiated http transport for the API, created and initialized with credentials by the root Arlula client
 * @param {string}        id     ID of the resource to download
 */
export declare function downloadHelper(client: AxiosInstance, id: string): Promise<ArrayBuffer | Buffer>;
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
export declare enum ResourceType {
    ImageryTiff = "img_tiff",
    ImageryJP2 = "img_jp2",
    Thumb = "thumb",
    Overview = "gdal_tiff_overview",
    MetadataMTL = "meta_mtl",
    MetadataJSON = "meta_json",
    MetadataXML = "meta_xml",
    MetadataBundle = "meta_bundle",
    GeometryJSON = "geo_json",
    GeometryKml = "geo_kml",
    GeometryShapefile = "geo_shp",
    GeometryBundle = "geo_bundle",
    License = "license"
}
