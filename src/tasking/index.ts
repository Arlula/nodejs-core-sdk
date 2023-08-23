import Order, { fromJSON as OrderFromJSON } from "../orders/order";
import paths from "../util/paths";
import { jsonOrError, requestBuilder } from "../util/request";
import TaskingSearchRequest from "./search-request";
import { TaskingSearchResponse } from "./search-response";

/**
 * @class Tasking wraps the API requests to the imagery tasking API
 */
export default class Tasking {
    private _client: requestBuilder;
    /**
     * creates a new tasking API client
     * @constructor
     * @param {requestBuilder} client the initiated http transport for the API, created and initialized with credentials by the root Arlula client
     * 
     * @see {@link ../index|Arlula}
     */
    constructor(client: requestBuilder) {
        this._client = client;
    }

    /**
     * conduct an tasking option search
     * 
     * @param {SearchRequest} req the details of the search request
     * @returns {Promise<SearchResult[]>} The list of search results
     * 
     * @see {https://arlula.com/documentation/#tasking-search|Tasking Search endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/#ref-search-result|Tasking Search result structure reference}
     */
    search(req: TaskingSearchRequest): Promise<TaskingSearchResponse> {
        if (!req.valid()) {
            return Promise.reject("request not valid");
        }
        return this._client("POST", paths.TaskingSearch, req._toJSON())
        .then(jsonOrError)
        .then((resp) => {
            if (Array.isArray(resp)) {
                const results = decodeResultSet(resp);
                if (!results) {
                    return Promise.reject({errors: ["error decoding search results"]});
                }
                return {results};
            } else if (typeof resp === "object") {
                const response = decodeResponse(resp);
                if (!response) {
                    return Promise.reject({errors: ["error decoding search response"]});
                }
    
                return response;
            } else {
                return Promise.reject({errors: ["response was not a valid search response object"]});
            }
        })
        .catch((msg: string) => {
            return Promise.reject({errors: [msg]});
        })
    }

    /**
     * Order tasking capacity
     * 
     * @warning this may charge your API account's credit card.  
     * Check the relevant SearchResult's `calculatePrice` function for the intended bundle and license
     * 
     * @param {OrderRequest} req the details of the order to be placed
     * @returns {Promise<Order>} The order that was placed
     * 
     * @see {https://arlula.com/documentation/#tasking-order|Tasking Order endpoint documentation}
     * or
     * @see {https://arlula.com/documentation/#ref-order-request|Tasking order request structure reference}
     */
    order(req: TaskingOrderRequest): Promise<Order> {
        if (!req.valid()) {
            return Promise.reject("invalid order request");
        }
        return this._client("POST", paths.TaskingOrder, req._toJSON(true))
        .then(jsonOrError)
        .then((resp) => {

            const ord = OrderFromJSON(this._client, resp as {[key: string]: unknown});
            if (!(ord instanceof Order)) {
                return Promise.reject(ord);
            }

            return ord;
        });
    }

    batchOrder(req: TaskingBatchOrderRequest): Promise<Order[]> {
        if (!req.valid()) {
            return Promise.reject("invalid order request");
        }
        return this._client("POST", paths.TaskingOrderBatch, req._toJSON(true))
        .then(jsonOrError)
        .then((resp) => {

            if (!Array.isArray(resp)) {
                return Promise.reject("error placing batch order, response is not array or orders")
            }

            const ords: Order[] = [];

            for (let i=0; i<resp.length; i++) {
                const ord = OrderFromJSON(this._client, resp[i] as {[key: string]: unknown});
                if (!(ord instanceof Order)) {
                    return Promise.reject(ord);
                }
                ords.push(ord)
            }

            return ords;
        });
    }
}