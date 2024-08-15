import Resource, {fromJSON as resourceFromJSON} from "./resource";
import paths from "../util/paths";
import { jsonOrError, requestBuilder } from "../util/request";
import { isStatusCode, StatusCode } from "./status";
import decodePolygon from "../archive/search/polygon";

/**
 * Utility class to construct Datasets from JSON data
 * 
 * Note: only to be used internally, not by end users
 * @param {requestBuilder} client the dialer
 * @param json the JSON content to attempt to parse into a Dataset
 */
export function fromJSON(client: requestBuilder, json: string|{[key: string]: unknown}): Dataset|string {
    if (typeof json === "string") {
        json = JSON.parse(json);
    }

    if (!(json instanceof Object)) {
        return "JSON does not correspond to a Dataset object";
    }

    let orderKey: string;

    if (typeof json.id !== "string") {
        return "No ID for Dataset";
    }
    if (typeof json.createdAt !== "string") {
        return "No creation date for Dataset";
    }
    if (typeof json.updatedAt !== "string") {
        return "No update date for Dataset";
    }
    if (typeof json.supplier !== "string") {
        return "Dataset supplier missing";
    }
    if (typeof json.imageryID === "string") {
        orderKey = json.imageryID;
    } else if (typeof json.orderingID === "string") {
        orderKey = json.orderingID;
    } else {
        return "ordering ID missing from Dataset";
    }
    if (typeof json.sceneID !== "string") {
        return "Scene ID missing form Dataset";
    }
    if (typeof json.status !== "string") {
        return "Dataset status missing";
    }
    if (!isStatusCode(json.status)) {
        return `Dataset status '${json.status}' not recognized`;
    }
    if (typeof json.total !== "number") {
        return "Dataset total missing";
    }
    if (typeof json.type !== "string") {
        return "Dataset type missing";
    }
    if (typeof json.bundle !== "string") {
        return "Dataset bundle missing";
    }
    if (typeof json.eula !== "string") {
        return "Dataset eula missing";
    }
    if (typeof json.discount !== "number") {
        return "Dataset discount missing";
    }
    if (typeof json.tax !== "number") {
        return "Dataset tax missing";
    }
    if (typeof json.order !== "string") {
        return "Dataset order missing";
    }
    let campaign = "";
    if (typeof json.campaign === "string") {
        campaign = json.campaign;
    }
    if (!(json?.aoi)) {
        return "Dataset aoi missing";
    }
    const polygon = decodePolygon(json.aoi)
    if (!polygon) {
        return "invalid dataset polygon";
    }
    let date: Date|undefined
    if (json.datetime) {
        if (typeof json.datetime !== "string") {
            return "Dataset datetime missing";
        }
        date = new Date(json.datetime);
    }
    if (json.expiration && !(typeof json.expiration === "string" || json.expiration instanceof Date)) {
        return "Dataset Expiration invalid formatting";
    }

    const resources: Resource[] = [];
    if (json.resources && Array.isArray(json.resources)) {
        for (let i=0; i<json.resources.length; i++) {
            const res = resourceFromJSON(client, json.resources[i]);
            if (res instanceof Resource) {
                resources.push(res);
                continue;
            }
            return res;
        }
    }

    return new Dataset(
        client,
        json.id, 
        new Date(json.createdAt), 
        new Date(json.updatedAt), 
        json.type,
        json.status,
        json.supplier, 
        orderKey, 
        json.sceneID, 
        json.bundle, 
        json.eula,
        json.total,
        json.discount,
        json.tax, 
        json.order, 
        campaign,
        polygon,
        date,
        resources, 
        json.expiration?new Date(json.expiration as string|Date):undefined,
    );
}

/**
 * @class Dataset wraps the data that makes up an dataset
 * 
 * Note: construction of this class is to only be done internally to the library
 * 
 * @see {https://arlula.com/documentation/#ref-dataset|Dataset structure reference}
 */
export default class Dataset {
    private _client: requestBuilder;
    private _id: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _type: string;
    private _status: StatusCode;
    private _supplier: string;
    private _orderingID: string;
    private _sceneID: string;
    private _bundle: string;
    private _eula: string;
    private _total: number;
    private _discount: number;
    private _tax: number;
    private _order: string;
    private _campaign: string;
    private _expiration?: Date;
    private _aoi: number[][][];
    private _datetime?: Date;
    private _resources: Resource[] = [];
    private detailed = false;
    /**
     * Create a new dataset instance
     * @constructor
     * 
     * @param {requestBuilder} client    The initiated http transport for the API, created and initialized with credentials by the root Arlula client
     * @param {string}        id        The Dataset ID
     * @param {Date}          created   The timestamp when the dataset was created (UTC timezone)
     * @param {Date}          updated   The timestamp when the dataset was last updated (UTC timezone)
     * @param {string}        type      Dataset type identifier (i.e. 'archive-scene', 'archive-aoi', etc)
     * @param {StatusCode}    status    Status of the dataset (pending, processing, complete, etc @see StatusCode)
     * @param {string}        supplier  The name of the supplier providing this dataset
     * @param {string}        imgID     ID string used to order this scene (Arlula internal ID structure)
     * @param {string}        scene     Scene identifier (supplier specific identifier)
     * @param {string}        bundle    the bundle key ordered to create this dataset
     * @param {string}        eula      the end user license this dataset was ordered under
     * @param {number}        total     Price paid for the dataset in US Cents
     * @param {number}        discount  the discount to the total price this dataset received
     * @param {number}        tax       the tax collected on this dataset
     * @param {string}        order     the order this dataset belongs to
     * @param {string}        campaign  the campaign (if type is tasking) this dataset belongs to
     * @param {number[][][]}  aoi       the polygon defining the area of interest (footprint) of this dataset
     * @param {Date}          datetime  the center datetime this dataset corresponds to
     * @param {Resource[]}    resources List of resource for this supplier (if available)
     * @param {Date}          [exp]     Expiration date for this datasets resources
     */
    constructor(
        client: requestBuilder,
        id: string,
        created: Date,
        updated: Date,
        type: string,
        status: StatusCode,
        supplier: string,
        orderKey: string,
        scene: string,
        bundle: string,
        eula: string,
        total: number,
        discount: number,
        tax: number,
        order: string,
        campaign: string,
        aoi: number[][][],
        datetime: Date|undefined,
        resources: Resource[],
        exp?: Date,
    ) {
        this._client = client;
        this._id = id;
        this._createdAt = created;
        this._updatedAt = updated;
        this._supplier = supplier;
        this._orderingID = orderKey;
        this._sceneID = scene;
        this._status = status;
        this._total = total;
        this._type = type;
        this._expiration = exp;
        this._bundle = bundle;
        this._eula = eula;
        this._discount = discount;
        this._tax = tax;
        this._order = order;
        this._campaign = campaign;
        this._aoi = aoi;
        this._datetime = datetime;
        this._resources = resources;
        if (this.resources.length) {
            this.detailed = true;
        }
    }

    // public getters
    // provides an interface to get dataset fields, without providing a setter interface
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
    public get supplier(): string {
        return this._supplier;
    }
    public get orderingID(): string {
        return this._orderingID;
    }
    public get sceneID(): string {
        return this._sceneID;
    }
    public get status(): StatusCode {
        return this._status;
    }
    public get total(): number {
        return this._total;
    }
    public get type(): string {
        return this._type;
    }
    public get expiration(): Date|null {
        if (this._expiration) {
            return this._expiration;
        }
        return null;
    }
    public get resources(): Resource[] {
        return this._resources;
    }

    public get bundle(): string {
        return this._bundle;
    }
    public get eula(): string {
        return this._eula;
    }
    public get discount(): number {
        return this._discount;
    }
    public get tax(): number {
        return this._tax;
    }
    public get order(): string {
        return this._order;
    }
    public get campaign(): string {
        return this._campaign;
    }
    public get aoi(): number[][][] {
        return this._aoi;
    }
    public get datetime(): Date|undefined {
        return this._datetime;
    }

    /**
     * load and return the resources for this dataset (if they exist)
     * 
     * Note: datasets that are not in the 'complete' state will not have resources yet
     * 
     * @returns {Promise<Resource[]>} The list of resources for this dataset
     */
    loadResources(): Promise<Resource[]> {
        // incomplete datasets don't have resources yet
        if (this.status !== StatusCode.Complete) {
            return Promise.resolve(this._resources);
        }

        // resources already loaded
        if (this.detailed) {
            return Promise.resolve(this._resources);
        }

        return this._client("GET", paths.DatasetGet(this._id))
        .then(jsonOrError)
        .then((resp) => {
            if (typeof resp !== "object") {
                return Promise.reject("Dataset response is not an object");
            }
            if (!resp) {
                return Promise.reject("Dataset response is not an object")
            }

            // JSON structure not known, use iterable form
            const r = (resp  as {[key: string]: unknown})

            if (!("resources" in r)) {
                // dataset has no resources
                this.detailed = true;
                return [];
            }

            if (!Array.isArray(r.resources)) {
                return Promise.reject("Resources is not an array");
            }

            const resources: Resource[] = [];
            for (let i=0; i<r.resources.length; i++) {
                const res = resourceFromJSON(this._client, r.resources[i]);
                if (!(res instanceof Resource)) {
                    // error in decoding, pass error up the chain
                    return Promise.reject(res);
                }
                resources.push(res);
            }

            this.detailed = true;
            this._resources = resources;
            return resources;
        });
    }

}
