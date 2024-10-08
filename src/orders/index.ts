import { WriteStream } from "fs";
import Order, { fromJSON as orderFromJSON } from "./order";
import Campaign, { fromJSON as campaignFromJSON } from "./campaign";
import Dataset, { fromJSON as datasetFromJSON } from "./dataset";
import Resource, { fromJSON as resourceFromJSON, downloadHelper as resourceDownloader, downloadFileHelper } from "./resource";
import paths from "../util/paths";
import { jsonOrError, requestBuilder } from "../util/request";
import { ListResponse, parseListResponse } from "./lists";

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
     * @returns {Promise<ListResponse<Order>>} the list of orders
     * 
     * @see {https://arlula.com/documentation/orders/#order-list|Orders List endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/orders/#ref-order|Order structure reference}
     */
    orderList(page?: number): Promise<ListResponse<Order>> {
        return this._client("GET", paths.OrderList()+(page ? `?page=${page}` : ""))
        .then(jsonOrError)
        .then((resp) => {
            if (!(resp instanceof Object)) {
                return Promise.reject("Order list endpoint returned a malformed response");
            }

            const list = parseListResponse<Order>(this._client, resp as {[key: string]: unknown}, orderFromJSON)
            if (typeof list === "string") {
                return Promise.reject(list);
            }

            return list;
        });
    }

    /**
     * list tasking campaigns previously lodged by this API from newest to oldest
     * @returns {Promise<ListResponse<Campaign>>} the list of tasking campaigns
     * 
     * @see {https://arlula.com/documentation/orders/#campaign-list|Campaign List endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/orders/#ref-campaign|Campaign structure reference}
     */
    campaignList(page?: number): Promise<ListResponse<Campaign>> {
        return this._client("GET", paths.CampaignList()+(page ? `?page=${page}` : ""))
        .then(jsonOrError)
        .then((resp) => {
            if (!(resp instanceof Object)) {
                return Promise.reject("Campaign list endpoint returned a malformed response");
            }

            const list = parseListResponse<Campaign>(this._client, resp as {[key: string]: unknown}, campaignFromJSON)
            if (typeof list === "string") {
                return Promise.reject(list);
            }

            return list;
        });
    }

    /**
     * list datasets available to this API from newest to oldest.
     * this will include both those created by archive orders, 
     * and those generated by delivery from a tasking campaign
     * @returns {Promise<ListResponse<Dataset>>} the list of datasets
     * 
     * @see {https://arlula.com/documentation/orders/#dataset-list|Dataset List endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/orders/#ref-dataset|Dataset structure reference}
     */
    datasetList(page?: number): Promise<ListResponse<Dataset>> {
        return this._client("GET", paths.DatasetList()+(page ? `?page=${page}` : ""))
        .then(jsonOrError)
        .then((resp) => {
            if (!(resp instanceof Object)) {
                return Promise.reject("Campaign list endpoint returned a malformed response");
            }

            const list = parseListResponse<Dataset>(this._client, resp as {[key: string]: unknown}, datasetFromJSON)
            if (typeof list === "string") {
                return Promise.reject(list);
            }

            return list;
        });
    }

    /**
     * Gets a specific order from the server from its ID
     * @param {string} id the ID of the order to retrieve
     * @returns {Promise<Order>} the order retrieved
     * 
     * @see {https://arlula.com/documentation/orders/#order-get|Orders Get endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/orders/#ref-order|Order structure reference}
     */
    getOrder(id: string): Promise<Order> {
        return this._client("GET", paths.OrderGet(id))
        .then(jsonOrError)
        .then((resp) => {
            if (typeof resp !== "object") {
                return Promise.reject("Order is not an object");
            }

            const ord = orderFromJSON(this._client, resp as {[key: string]: unknown});
            if (!(ord instanceof Order)) {
                return Promise.reject(ord);
            }
            return ord;
        });
    }

    /**
     * Gets a specific tasking campaign from the server from its ID
     * @param {string} id the ID of the campaign to retrieve
     * @returns {Promise<Campaign>} the campaign retrieved
     * 
     * @see {https://arlula.com/documentation/orders/#campaign-get|Campaign Get endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/orders/#ref-campaign|Campaign structure reference}
     */
    getCampaign(id: string): Promise<Campaign> {
        return this._client("GET", paths.CampaignGet(id))
        .then(jsonOrError)
        .then((resp) => {
            if (typeof resp !== "object") {
                return Promise.reject("Campaign is not an object");
            }

            const ord = campaignFromJSON(this._client, resp as {[key: string]: unknown});
            if (!(ord instanceof Campaign)) {
                return Promise.reject(ord);
            }
            return ord;
        });
    }

    /**
     * Gets a specific dataset from the server from its ID
     * @param {string} id the ID of the dataset to retrieve
     * @returns {Promise<Dataset>} the dataset retrieved
     * 
     * @see {https://arlula.com/documentation/orders/#dataset-get|Dataset Get endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/orders/#ref-dataset|Dataset structure reference}
     */
    getDataset(id: string): Promise<Dataset> {
        return this._client("GET", paths.DatasetGet(id))
        .then(jsonOrError)
        .then((resp) => {
            if (typeof resp !== "object") {
                return Promise.reject("Dataset is not an object");
            }

            const ord = datasetFromJSON(this._client, resp as {[key: string]: unknown});
            if (!(ord instanceof Dataset)) {
                return Promise.reject(ord);
            }
            return ord;
        });
    }

    /**
     * Get a specific resource from a cached ID to access its roles and details
     * @param {string} id the ID of the resource to retrieve
     * @returns {Promise<Resource>} the resource retrieved
     * 
     * @see {https://arlula.com/documentation/orders/#resource-get|Resource Get endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/orders/#ref-resource|Resource structure reference}
     */
    getResource(id: string): Promise<Resource> {
        return this._client("GET", paths.ResourceGet(id))
        .then(jsonOrError)
        .then((resp) => {
            if (typeof resp !== "object") {
                return Promise.reject("Resource is not an object");
            }

            const ord = resourceFromJSON(this._client, resp as {[key: string]: unknown});
            if (!(ord instanceof Resource)) {
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
     * @see {https://arlula.com/documentation/orders/#order-resource|Order Resource Get endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/orders/#ref-resource|Order Resource structure reference}
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
     * @see {https://arlula.com/documentation/orders/#order-resource|Order Resource Get endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/orders/#ref-resource|Order Resource structure reference}
     */
    downloadResourceToFile(id: string, ref: string|WriteStream): Promise<WriteStream> {
        return downloadFileHelper(this._client, id, ref);
    }
}
