import { WriteStream } from "fs";
import Dataset, { fromJSON } from "./dataset";
import { downloadHelper as resourceDownloader, downloadFileHelper } from "./resource";
import paths from "../util/paths";
import { jsonOrError, requestBuilder } from "../util/request";

/**
 * @class Orders wraps the API requests to the order management API
 */
export default class Orders {
    private _client: requestBuilder;
    /**
     * creates a new orders API client
     * @constructor
     * @param {requestBuilder} client the initiated http transport for the API, created and initialized with credentials by the root Arlula client
     * 
     * @see {@link ../index|Arlula}
     */
    constructor(client: requestBuilder) {
        this._client = client;
    }

    /**
     * list orders previously placed by this API from newest to oldest
     * @returns {Promise<Order[]>} the list of orders
     * 
     * @see {https://arlula.com/documentation/#order-list|Orders List endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/#ref-order|Order structure reference}
     */
    list(): Promise<Dataset[]> {
        return this._client("GET", paths.OrderList)
        .then(jsonOrError)
        .then((resp) => {
            if (!Array.isArray(resp)) {
                return Promise.reject("Orders list response is not array");
            }

            const orders: Dataset[] = [];
            for (let i=0; i<resp.length; i++) {
                const ord = fromJSON(this._client, resp[i])
                if (!(ord instanceof Dataset)) {
                    return Promise.reject(ord);
                }
                orders.push(ord);
            }

            return orders;
        });
    }

    /**
     * Gets a specific order from the server from its ID
     * @param {string} id the ID of the order to retrieve
     * @returns {Promise<Order>} the order retrieved
     * 
     * @see {https://arlula.com/documentation/#order-get|Orders Get endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/#ref-order|Order structure reference}
     */
    get(id: string): Promise<Dataset> {
        return this._client("GET", paths.OrderGet+"?id="+id)
        .then(jsonOrError)
        .then((resp) => {
            if (typeof resp !== "object") {
                return Promise.reject("Order is not an object");
            }

            const ord = fromJSON(this._client, resp as {[key: string]: unknown});
            if (!(ord instanceof Dataset)) {
                return Promise.reject(ord);
            }
            return ord;
        });
    }

    /**
     * Download the content of a resource (imagery, metadata, etc) based on its ID
     * Data is made available as an ArrayBuffer.
     * 
     * Note: If the order this resource is for has its `expiration` field set and that date has
     * passed, this request will fail as the resource has expired and is no longer hosted in the platform
     * 
     * @param {string} id The ID of the resource to download
     * @returns {Promise<ArrayBuffer>} the content of the resource as a Buffer
     * 
     * @see {https://arlula.com/documentation/#order-resource|Order Resource Get endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/#ref-resource|Order Resource structure reference}
     */
    downloadResource(id: string): Promise<ArrayBuffer> {
        return resourceDownloader(this._client, id);
    }

    /**
     * Download the content of a resource (imagery, metadata, etc)
     * Data is piped into the provided fs.WriteStream or one is created at the provided filepath.
     * 
     * Note: If the order this resource is for has its `expiration` field set and that date has
     * passed, this request will fail as the resource has expired and is no longer hosted in the platform
     * 
     * @param {string} id The ID of the resource to download
     * @returns {Promise<WriteStream>} file the resource was written to
     * 
     * @see {https://arlula.com/documentation/#order-resource|Order Resource Get endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/#ref-resource|Order Resource structure reference}
     */
    downloadResourceToFile(id: string, ref: string|WriteStream): Promise<WriteStream> {
        return downloadFileHelper(this._client, id, ref);
    }
}
