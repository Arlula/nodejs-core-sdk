/// <reference types="node" />
import Order from "./order";
import { AxiosInstance } from "axios";
/**
 * @class Orders wraps the API requests to the order management API
 */
export default class Orders {
    private _client;
    /**
     * creates a new orders API client
     * @constructor
     * @param {AxiosInstance} client the initiated http transport for the API, created and initialized with credentials by the root Arlula client
     *
     * @see {@link ../index|Arlula}
     */
    constructor(client: AxiosInstance);
    /**
     * list orders previously placed by this API from newest to oldest
     * @returns {Promise<Order[]>} the list of orders
     */
    list(): Promise<Order[]>;
    /**
     * Gets a specific order from the server from its ID
     * @param {string} id the ID of the order to retrieve
     * @returns {Promise<Order>} the order retrieved
     */
    get(id: string): Promise<Order>;
    /**
     * Download the content of a resource (imagery, metadata, etc) based on its ID
     * Data is made available as an ArrayBuffer or Buffer depending upon platform.
     *
     * Note: If the order this resource is for has its `expiration` field set and that date has
     * passed, this request will fail as the resource has expired and is no longer hosted in the platform
     *
     * @param {string} id The ID of the resource to download
     * @returns {Promise<ArrayBuffer|Buffer>} the content of the resource as a Buffer
     */
    downloadResource(id: string): Promise<ArrayBuffer | Buffer>;
}
