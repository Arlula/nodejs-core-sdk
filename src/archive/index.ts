import SearchRequest from "./search-request";
import SearchResult from "./search-result";
import Order, { fromJSON as OrderFromJSON } from "../orders/order";
import OrderRequest from "./order-request";
import paths from "../util/paths";
import { jsonOrError, requestBuilder } from "../util/request";

/**
 * @class Archive wraps the API requests to the archive imagery API
 */
export default class Archive {
    private _client: requestBuilder;
    /**
     * creates a new archive API client
     * @constructor
     * @param {requestBuilder} client the initiated http transport for the API, created and initialized with credentials by the root Arlula client
     * 
     * @see {@link ../index|Arlula}
     */
    constructor(client: requestBuilder) {
        this._client = client;
    }

    /**
     * conduct an archive imagery search
     * 
     * @param {SearchRequest} req the details of the search request
     * @returns {Promise<SearchResult[]>} The list of search results
     * 
     * @see {https://arlula.com/documentation/#archive-search|Archive Search endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/#ref-search-result|Archive Search result structure reference}
     */
    search(req: SearchRequest): Promise<SearchResult[]> {
        if (!req.valid()) {
            return Promise.reject("request not valid");
        }
        return this._client("GET", paths.ArchiveSearch+req._toQueryString())
        .then(jsonOrError)
        .then((resp) => {
            if (!Array.isArray(resp)) {
                return Promise.reject("response was not an array of results");
            }

            return resp as SearchResult[];
        });
    }

    /**
     * Order archive imagery
     * 
     * @warning this may charge your API account's credit card.  
     * Check the relevant SearchResult's `price` field
     * 
     * @param {OrderRequest} req the details of the order to be placed
     * @returns {Promise<Order>} The order that was placed
     * 
     * @see {https://arlula.com/documentation/#archive-order|Archive Order endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/#ref-order-request|Archive order request structure reference}
     */
    order(req: OrderRequest): Promise<Order> {
        if (!req.valid()) {
            return Promise.reject("invalid order request");
        }
        // NOTE: suppliers with immediate fulfillment may take longer to process while delivering resources
        // give a longer timeout to respect this and not timeout a successful order
        return this._client("POST", paths.ArchiveOrder, req._toJSON(true), 120*1000)
        .then(jsonOrError)
        .then((resp) => {

            const ord = OrderFromJSON(this._client, resp as {[key: string]: unknown});
            if (!(ord instanceof Order)) {
                return Promise.reject(ord);
            }

            return ord;
        });
    }
}
