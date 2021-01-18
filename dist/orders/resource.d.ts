import { AxiosInstance } from "axios";
export declare function fromJSON(client: AxiosInstance, json: string | {
    [key: string]: any;
}): Resource | string;
export default class Resource {
    private _client;
    private _id;
    private _createdAt;
    private _updatedAt;
    private _order;
    private _name;
    private _type;
    constructor(client: AxiosInstance, id: string, created: Date, updated: Date, order: string, name: string, type: ResourceType);
    get id(): string;
    get createdAt(): Date;
    get updatedAt(): Date;
    get order(): string;
    get name(): string;
    get type(): ResourceType;
    download(): Promise<ArrayBuffer>;
}
export declare function downloadHelper(client: AxiosInstance, id: string): Promise<ArrayBuffer>;
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
