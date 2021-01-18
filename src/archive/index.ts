import SearchRequest from "./search-request";
import SearchResult from "./search-result";
import Order, { fromJSON as OrderFromJSON } from "../orders/order";
import OrderRequest from "./order-request";
import { AxiosInstance } from "axios";

const searchURL = "https://api.arlula.com/api/archive/search";
const orderURL = "https://api.arlula.com/api/archive/order";

export default class Archive {
    private _client: AxiosInstance;
    constructor(client: AxiosInstance) {
        this._client = client;
    }

    Search(req: SearchRequest): Promise<SearchResult[]> {
        if (!req.valid()) {
            return Promise.reject("request not valid");
        }
        return this._client.get(searchURL, {params: req.toQuery()})
        .then((resp) => {
            if (!Array.isArray(resp.data)) {
                return Promise.reject("response was not an array of results");
            }

            return resp.data as SearchResult[];
        });
    }

    Order(req: OrderRequest): Promise<Order> {
        if (!req.valid()) {
            return Promise.reject("invalid order request");
        }
        return this._client.post(orderURL, req.toJSON())
        .then((resp) => {

            const ord = OrderFromJSON(this._client, resp.data);
            if (!(ord instanceof Order)) {
                return Promise.reject(ord);
            }

            return ord;
        });
    }
}
