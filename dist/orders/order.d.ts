import { AxiosInstance } from "axios";
import Resource from "./resource";
/**
 * Utility class to construct Orders from JSON data
 *
 * Note: only to be used internally, not by end users
 * @param {AxiosInstance} client the dialer
 * @param json the JSON content to attempt to parse into an Order
 */
export declare function fromJSON(client: AxiosInstance, json: string | {
    [key: string]: unknown;
}): Order | string;
/**
 * @class Order wraps the data that makes up an order
 *
 * Note: construction of this class is to only be done internally to the library
 */
export default class Order {
    private _client;
    private _id;
    private _createdAt;
    private _updatedAt;
    private _supplier;
    private _imageryID;
    private _sceneID;
    private _status;
    private _total;
    private _type;
    private _expiration?;
    private _resources;
    private detailed;
    /**
     * Create a new order instance
     * @constructor
     *
     * @param {AxiosInstance} client    The initiated http transport for the API, created and initialized with credentials by the root Arlula client
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
    constructor(client: AxiosInstance, id: string, created: Date, updated: Date, supplier: string, imgID: string, scene: string, status: OrderStatus, total: number, type: string, resources: Resource[], exp?: Date);
    get id(): string;
    get createdAt(): Date;
    get updatedAt(): Date;
    get supplier(): string;
    get imageryID(): string;
    get sceneID(): string;
    get status(): OrderStatus;
    get total(): number;
    get type(): string;
    get expiration(): Date | null;
    get resources(): Resource[];
    /**
     * load and return the resources for this order (if they exist)
     *
     * Note: orders that are not in the 'complete' state will not have resources yet
     *
     * @returns {Promise<Resource[]>} The list of resources for this order
     */
    loadResources(): Promise<Resource[]>;
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
export declare enum OrderStatus {
    New = "created",
    Pending = "pending",
    Processing = "processing",
    Manual = "manual",
    PostProcessing = "post-processing",
    Complete = "complete"
}
