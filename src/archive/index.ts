import SearchRequest from "./search-request";
import SearchResult from "./search-result";
import Order, { fromJSON as OrderFromJSON } from "../orders/order";
import OrderRequest from "./order-request";
import { AxiosInstance } from "axios";
import { handleError } from "../util/error";

const searchURL = "https://api.arlula.com/api/archive/search";
const orderURL = "https://api.arlula.com/api/archive/order";

export default class Archive {
    private _client: AxiosInstance;
    constructor(client: AxiosInstance) {
        this._client = client;
    }

    search(req: SearchRequest): Promise<SearchResult[]> {
        if (!req.valid()) {
            return Promise.reject("request not valid");
        }
        return this._client.get(searchURL, {params: req.toQuery()})
        .then((resp) => {
            if (!Array.isArray(resp.data)) {
                return Promise.reject("response was not an array of results");
            }

            return resp.data as SearchResult[];
        })
        .catch(handleError);
    }

    order(req: OrderRequest): Promise<Order> {
        if (!req.valid()) {
            return Promise.reject("invalid order request");
        }
        // NOTE: suppliers with immediate fulfillment may take longer to process while delivering resources
        // give a longer timeout to respect this and not timeout a successful order
        return this._client.post(orderURL, req.toJSON(), {timeout: 120*1000})
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
