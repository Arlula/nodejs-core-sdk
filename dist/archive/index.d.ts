import SearchRequest from "./search-request";
import SearchResult from "./search-result";
import Order from "../orders/order";
import OrderRequest from "./order-request";
import { AxiosInstance } from "axios";
/**
 * @class Archive wraps the API requests to the archive imagery API
 */
export default class Archive {
    private _client;
    /**
     * creates a new archive API client
     * @constructor
     * @param {AxiosInstance} client the initiated http transport for the API, created and initialized with credentials by the root Arlula client
     *
     * @see {@link ../index|Arlula}
     */
    constructor(client: AxiosInstance);
    /**
     * conduct an archive imagery search
     *
     * @param {SearchRequest} req the details of the search request
     * @returns {Promise<SearchResult[]>} The list of search results
     */
    search(req: SearchRequest): Promise<SearchResult[]>;
    /**
     * Order archive imagery
     *
     * @warning this may charge your API account's credit card.
     * Check the relevant SearchResult's `price` field
     *
     * @param {OrderRequest} req the details of the order to be placed
     * @returns {Promise<Order>} The order that was placed
     */
    order(req: OrderRequest): Promise<Order>;
}
