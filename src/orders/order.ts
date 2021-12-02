import Resource, {fromJSON as resourceFromJSON} from "./resource";
import paths from "../util/paths";
import { jsonOrError, requestBuilder } from "../util/request";

/**
 * Utility class to construct Orders from JSON data
 * 
 * Note: only to be used internally, not by end users
 * @param {requestBuilder} client the dialer
 * @param json the JSON content to attempt to parse into an Order
 */
export function fromJSON(client: requestBuilder, json: string|{[key: string]: unknown}): Order|string {
    if (typeof json === "string") {
        json = JSON.parse(json);
    }

    if (!(json instanceof Object)) {
        return "JSON does not correspond to an Order object";
    }

    if (typeof json.id !== "string") {
        return "No ID for order";
    }
    if (typeof json.createdAt !== "string") {
        return "No creation date for order";
    }
    if (typeof json.updatedAt !== "string") {
        return "No update date for order";
    }
    if (typeof json.supplier !== "string") {
        return "Order supplier missing";
    }
    if (typeof json.imageryID !== "string") {
        return "Imagery ID missing from Order";
    }
    if (typeof json.sceneID !== "string") {
        return "Scene ID missing form Order";
    }
    if (typeof json.status !== "string") {
        return "Order status missing";
    }
    if (!isOrderStatus(json.status)) {
        return `Order status '${json.status}' not recognized`;
    }
    if (typeof json.total !== "number") {
        return "Order total missing";
    }
    if (typeof json.type !== "string") {
        return "Order type missing";
    }
    if (json.expiration && !(typeof json.expiration === "string" || json.expiration instanceof Date)) {
        return "Order Expiration invalid formatting";
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

    return new Order(client, json.id, new Date(json.createdAt), new Date(json.updatedAt), json.supplier, json.imageryID, json.sceneID, json.status, json.total, json.type, resources, json.expiration?new Date(json.expiration as string|Date):undefined);
}

/**
 * @class Order wraps the data that makes up an order
 * 
 * Note: construction of this class is to only be done internally to the library
 * 
 * @see {https://arlula.com/documentation/#ref-order|Order structure reference}
 */
export default class Order {
    private _client: requestBuilder;
    private _id: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _supplier: string;
    private _imageryID: string;
    private _sceneID: string;
    private _status: OrderStatus;
    private _total: number;
    private _type: string;
    private _expiration?: Date;
    private _resources: Resource[] = [];
    private detailed = false;
    /**
     * Create a new order instance
     * @constructor
     * 
     * @param {requestBuilder} client    The initiated http transport for the API, created and initialized with credentials by the root Arlula client
     * @param {string}        id        The Order ID
     * @param {Date}          created   The timestamp when the order was created (UTC timezone)
     * @param {Date}          updated   The timestamp when the order was last updated (UTC timezone)
     * @param {string}        supplier  The name of the supplier fulfilling this order
     * @param {string}        imgID     ID string used to order this scene (Arlula internal ID structure)
     * @param {string}        scene     Scene identifier (supplier specific identifier)
     * @param {OrderStatus}   status    Status of the order (pending, processing, complete, etc @see OrderStatus)
     * @param {number}        total     Price paid for the order in US Cents
     * @param {string}        type      Order type identifier (i.e. 'archive-scene', 'archive-aoi', etc)
     * @param {Resource[]}    resources List of resource for this supplier (if available)
     * @param {Date}          [exp]     Expiration date for this orders resources
     */
    constructor(client: requestBuilder, id: string, created: Date, updated: Date, supplier: string, imgID: string, scene: string, status: OrderStatus, total: number, type: string, resources: Resource[], exp?: Date) {
        this._client = client;
        this._id = id;
        this._createdAt = created;
        this._updatedAt = updated;
        this._supplier = supplier;
        this._imageryID = imgID;
        this._sceneID = scene;
        this._status = status;
        this._total = total;
        this._type = type;
        this._expiration = exp;
        this._resources = resources;
        if (this.resources.length) {
            this.detailed = true;
        }
    }

    // public getters
    // provides an interface to get order fields, without providing a setter interface
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
    public get imageryID(): string {
        return this._imageryID;
    }
    public get sceneID(): string {
        return this._sceneID;
    }
    public get status(): OrderStatus {
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

    /**
     * load and return the resources for this order (if they exist)
     * 
     * Note: orders that are not in the 'complete' state will not have resources yet
     * 
     * @returns {Promise<Resource[]>} The list of resources for this order
     */
    loadResources(): Promise<Resource[]> {
        // incomplete orders don't have resources yet
        if (this.status !== OrderStatus.Complete) {
            return Promise.resolve(this._resources);
        }

        // resources already loaded
        if (this.detailed) {
            return Promise.resolve(this._resources);
        }

        return this._client("GET", paths.OrderGet+"?id="+this._id)
        .then(jsonOrError)
        .then((resp) => {
            if (typeof resp !== "object") {
                return Promise.reject("Order response is not an object");
            }
            if (!resp) {
                return Promise.reject("Order response is not an object")
            }

            // JSON structure not known, use iterable form
            const r = (resp  as {[key: string]: unknown})

            if (!("resources" in r)) {
                // order has no resources
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

/**
 * OrderStatus enumerates the statuses that orders may be in
 * 
 * New ------------> "created",
 * Pending --------> "pending",
 * Processing -----> "processing",
 * Manual ---------> "manual",
 * PostProcessing -> "post-processing",
 * Complete -------> "complete",
 */
export enum OrderStatus {
    New            = "created",
    Pending        = "pending",
    Processing     = "processing",
    Manual         = "manual",
    PostProcessing = "post-processing",
    Complete       = "complete",
}

function isOrderStatus(token: string): token is OrderStatus {
    return Object.values(OrderStatus).includes(token as OrderStatus);
}
