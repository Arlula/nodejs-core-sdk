import SearchRequest from "./search-request";
import SearchResult from "./search-result";
import Order, { fromJSON as OrderFromJSON } from "../orders/order";
import { client, request, RequestMethod } from "../util/client";
import OrderRequest from "./order-request";

const searchURL = "/api/archive/search";
const orderURL = "/api/archive/order";

export default class Archive {
    private _client: client;
    constructor(client: client) {
        this._client = client;
    }

    Search(req: SearchRequest): Promise<SearchResult[]> {
        return new Promise((resolve, reject) => {
            if (!req.valid()) {
                reject("request not valid");
                return;
            }
            const remoteReq = new request(searchURL);
            remoteReq.addBatchParams(req.toQuery());

            this._client.do(remoteReq)
            .then((resp) => {
                if (!resp.ok()) {
                    reject(resp.text());
                    return;
                }
                const body = resp.json();
                if (!Array.isArray(body)) {
                    reject("response was not an array of results");
                    return;
                }

                resolve(body as SearchResult[]);
            })
            .catch(reject);
        });
    }

    Order(req: OrderRequest): Promise<Order> {
        return new Promise((resolve, reject) => {
            if (!req.valid()) {
                reject("invalid order request");
                return;
            }

            const remoteReq = new request(orderURL, RequestMethod.Post)
            remoteReq.setBody(req.toJSON());

            this._client.do(remoteReq)
            .then((resp) => {
                if (resp.ok()) {
                    reject(resp.text());
                    return;
                }

                const ord = OrderFromJSON(this._client, resp.json());
                if (!(ord instanceof Order)) {
                    reject(ord);
                    return;
                }

                resolve(ord);
            })
            .catch(reject);
        })
    }
}
