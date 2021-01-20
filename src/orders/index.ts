import Order, { fromJSON } from "./order";
import { downloadHelper as resourceDownloader } from "./resource";
import { AxiosInstance } from "axios";
import { handleError } from "../util/error";

const listURL = "https://api.arlula.com/api/order/list";
const getURL = "https://api.arlula.com/api/order/get";

/**
 * @class Orders wraps the API requests to the order management API
 */
export default class Orders {
    private _client: AxiosInstance;
    /**
     * creates a new orders API client
     * @constructor
     * @param {AxiosInstance} client the initiated http transport for the API, created and initialized with credentials by the root Arlula client
     * 
     * @see {@link ../index|Arlula}
     */
    constructor(client: AxiosInstance) {
        this._client = client;
    }

    /**
     * list orders previously placed by this API from newest to oldest
     * @returns {Promise<Order[]>} the list of orders
     */
    list(): Promise<Order[]> {
        return this._client.get(listURL)
        .then((resp) => {
            if (resp.status < 200 || resp.status >= 300) {
                return Promise.reject(resp.data);
            }

            if (!Array.isArray(resp.data)) {
                return Promise.reject("Orders list response is not array");
            }

            const orders: Order[] = [];
            for (let i=0; i<resp.data.length; i++) {
                const ord = fromJSON(this._client, resp.data[i])
                if (!(ord instanceof Order)) {
                    return Promise.reject(ord);
                }
                orders.push(ord);
            }

            return orders;
        })
        .catch(handleError);
    }

    /**
     * Gets a specific order from the server from its ID
     * @param {string} id the ID of the order to retrieve
     * @returns {Promise<Order>} the order retrieved
     */
    get(id: string): Promise<Order> {
        return this._client.get(getURL, {params: {id: id}})
        .then((resp) => {
            if (typeof resp.data !== "object") {
                return Promise.reject("Order is not an object");
            }

            const ord = fromJSON(this._client, resp.data);
            if (!(ord instanceof Order)) {
                return Promise.reject(ord);
            }
            return ord;
        })
        .catch(handleError);
    }

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
    downloadResource(id: string): Promise<ArrayBuffer|Buffer> {
        return resourceDownloader(this._client, id);
    }
}
