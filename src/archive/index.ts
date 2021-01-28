import SearchRequest from "./search-request";
import SearchResult from "./search-result";
import Order, { fromJSON as OrderFromJSON } from "../orders/order";
import OrderRequest from "./order-request";
import paths from "../util/paths";
import { AxiosInstance } from "axios";
import { handleError } from "../util/error";

/**
 * @class Archive wraps the API requests to the archive imagery API
 */
export default class Archive {
    private _client: AxiosInstance;
    /**
     * creates a new archive API client
     * @constructor
     * @param {AxiosInstance} client the initiated http transport for the API, created and initialized with credentials by the root Arlula client
     * 
     * @see {@link ../index|Arlula}
     */
    constructor(client: AxiosInstance) {
        this._client = client;
    }

    /**
     * conduct an archive imagery search
     * 
     * @param {SearchRequest} req the details of the search request
     * @returns {Promise<SearchResult[]>} The list of search results
     */
    search(req: SearchRequest): Promise<SearchResult[]> {
        if (!req.valid()) {
            return Promise.reject("request not valid");
        }
        return this._client.get(paths.ArchiveSearch, {params: req._toQuery()})
        .then((resp) => {
            if (!Array.isArray(resp.data)) {
                return Promise.reject("response was not an array of results");
            }

            return resp.data as SearchResult[];
        })
        .catch(handleError);
    }

    /**
     * Order archive imagery
     * 
     * @warning this may charge your API account's credit card.  
     * Check the relevant SearchResult's `price` field
     * 
     * @param {OrderRequest} req the details of the order to be placed
     * @returns {Promise<Order>} The order that was placed
     */
    order(req: OrderRequest): Promise<Order> {
        if (!req.valid()) {
            return Promise.reject("invalid order request");
        }
        // NOTE: suppliers with immediate fulfillment may take longer to process while delivering resources
        // give a longer timeout to respect this and not timeout a successful order
        return this._client.post(paths.ArchiveOrder, req._toJSON(false), {timeout: 120*1000})
        .then((resp) => {

            const ord = OrderFromJSON(this._client, resp.data);
            if (!(ord instanceof Order)) {
                return Promise.reject(ord);
            }

            return ord;
        })
        .catch(handleError);
    }
}
