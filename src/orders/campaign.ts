import paths from "../util/paths";
import { jsonOrError, requestBuilder } from "../util/request";
import Dataset from "./dataset";
import { isStatusCode, StatusCode } from "./status";
import decodePolygon from "../archive/search/polygon";

export function fromJSON(client: requestBuilder, json: string|{[key: string]: unknown}): Campaign|string {
    if (typeof json === "string") {
        json = JSON.parse(json);
    }

    if (!(json instanceof Object)) {
        return "JSON does not correspond to a Campaign object";
    }

    if (typeof json.id !== "string") {
        return "No ID for campaign";
    }
    if (typeof json.createdAt !== "string") {
        return "No creation date for campaign";
    }
    if (typeof json.updatedAt !== "string") {
        return "No update date for campaign";
    }
    if (typeof json.status !== "string") {
        return "Campaign status missing";
    }
    if (!isStatusCode(json.status)) {
        return `Campaign status '${json.status}' not recognized`;
    }
    if (typeof json.orderingID !== "string") {
        return "Campaign orderingID missing";
    }
    if (typeof json.bundle !== "string") {
        return "Campaign bundle missing";
    }
    if (typeof json.license !== "string") {
        return "Campaign license missing";
    }
    if (typeof json.priority !== "string") {
        return "Campaign priority missing";
    }
    if (typeof json.total !== "number") {
        return "Campaign total missing";
    }
    if (typeof json.discount !== "number") {
        return "Campaign discount missing";
    }
    if (typeof json.tax !== "number") {
        return "Campaign tax missing";
    }
    if (!json.refunded) {
        json.refunded = 0;
    }
    if (typeof json.refunded !== "number") {
        return "Campaign refund missing";
    }
    if (typeof json.order !== "string") {
        return "Campaign order missing";
    }
    let site = "";
    if (typeof json.site === "string") {
        site = json.site;
    }
    if (typeof json.start !== "string") {
        return "Campaign missing start date";
    }
    if (typeof json.end !== "string") {
        return "Campaign missing end date";
    }
    if (!(json?.aoi)) {
        return "Campaign missing AOI";
    }
    const polygon = decodePolygon(json.aoi)
    if (!polygon) {
        return "Campaign AOI incorrectly structured";
    }
    if (typeof json.cloud !== "number") {
        return "Campaign missing cloud coverage";
    }
    if (typeof json.offNadir !== "number") {
        return "Campaign missing off nadir angle";
    }
    if (typeof json.supplier !== "string") {
        return "Campaign missing supplier";
    }
    const platforms: string[] = [];
    if (!Array.isArray(json.platforms)) {
        return "Campaign platforms list is not an array";
    }
    for (let i=0; i<json.platforms.length; i++) {
        if (typeof json.platforms[i] !== "string") {
            return "Campaign platform is not a string";
        }
        platforms.push(json.platforms[i]);
    }
    if (typeof json.gsd !== "number") {
        return "Campaign missing GSD";
    }

    return new Campaign(
        client,
        json.id,
        new Date(json.createdAt),
        new Date(json.updatedAt),
        json.status,
        json.orderingID,
        json.bundle,
        json.license,
        json.priority,
        json.total,
        json.discount,
        json.tax,
        json.refunded,
        json.order,
        site,
        new Date(json.start),
        new Date(json.end),
        polygon,
        json.cloud,
        json.offNadir,
        json.supplier,
        platforms,
        json.gsd,
    )
}

export default class Campaign {
    private _client: requestBuilder;

    // references and house keeping
    private _id: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _status: StatusCode;
    // checkout details
    private _orderingID: string;
    private _bundle: string;
    private _license: string;
    private _priority: string;
    // accounting record keeping
    private _total: number;
    private _discount: number;
    private _tax: number;
    private _refunded: number; // only populated if capture failed and refunded by supplier

    // creation details
    private _order: string;
    private _site: string;
    // private _monitor: string;

    // spatiotemporal location
    private _start: Date;
    private _end: Date;
    private _aoi: number[][][];

    // capture constraints
    private _cloud: number;
    private _offNadir: number;
    private _supplier: string;
    private _platforms: string[];
    private _gsd: number;

    // delivered data
    private _datasets: Dataset[] = [];

    constructor(
        client: requestBuilder,
        id: string,
        created: Date,
        updated: Date, 
        status: StatusCode,
        orderingID: string,
        bundle: string,
        license: string,
        priority: string,
        total: number,
        discount: number,
        tax: number,
        refunded: number,
        order: string,
        site: string,
        start: Date,
        end: Date,
        aoi: number[][][],
        cloud: number,
        offNadir: number,
        supplier: string,
        platforms: string[],
        gsd: number,
    ) {
        this._client = client;
        this._id = id;
        this._createdAt = created;
        this._updatedAt = updated;
        this._status = status;
        this._orderingID = orderingID;
        this._bundle = bundle;
        this._license = license;
        this._priority = priority;
        this._total = total;
        this._discount = discount;
        this._tax = tax;
        this._refunded = refunded;
        this._order = order;
        this._site = site;
        this._start = start;
        this._end = end;
        this._aoi = aoi;
        this._cloud = cloud;
        this._offNadir = offNadir;
        this._supplier = supplier;
        this._platforms = platforms;
        this._gsd = gsd;
    }

    public get id(): string {return this._id}
    public get createdAt(): Date {return this._createdAt}
    public get updatedAt(): Date {return this._updatedAt}
    public get status(): StatusCode {return this._status}
    public get orderingID(): string {return this._orderingID}
    public get bundle(): string {return this._bundle}
    public get license(): string {return this._license}
    public get priority(): string {return this._priority}
    public get total(): number {return this._total}
    public get discount(): number {return this._discount}
    public get tax(): number {return this._tax}
    public get refunded(): number {return this._refunded}
    public get order(): string {return this._order}
    public get site(): string {return this._site}
    public get start(): Date {return this._start}
    public get end(): Date {return this._end}
    public get aoi(): number[][][] {return this._aoi}
    public get cloud(): number {return this._cloud}
    public get offNadir(): number {return this._offNadir}
    public get supplier(): string {return this._supplier}
    public get platforms(): string[] {return this._platforms}
    public get gsd(): number {return this._gsd}
}