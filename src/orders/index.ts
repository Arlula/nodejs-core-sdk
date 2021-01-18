import Order, { fromJSON } from "./order";
import { downloadHelper as resourceDownloader } from "./resource";
import { client, request } from "../util/client";

const listURL = "/api/order/list";
const getURL = "/api/order/get";

export default class Orders {
    private _client: client;
    constructor(client: client) {
        this._client = client;
    }

    ListOrders(): Promise<Order[]> {
        return new Promise((resolve, reject) => {
            const req = new request(listURL);
            this._client.do(req)
            .then((resp) => {
                if (!resp.ok()) {
                    reject(resp.text());
                    return;
                }

                const body = resp.json();
                if (!Array.isArray(body)) {
                    reject("Orders list response is not array");
                    return;
                }

                const orders: Order[] = [];
                for (let i=0; i<body.length; i++) {
                    const ord = fromJSON(this._client, body[i])
                    if (!(ord instanceof Order)) {
                        reject(ord);
                        return;
                    }
                    orders.push(ord);
                }

                resolve(orders);
            })
            .catch(reject);
        });
    }

    GetOrder(): Promise<Order> {
        return new Promise((resolve, reject) => {
            const req = new request(getURL);
            this._client.do(req)
            .then((resp) => {
                if (!resp.ok()) {
                    reject(resp.text());
                    return;
                }

                const body = resp.json();
                if (typeof body !== "object") {
                    reject("Order is not an object");
                    return;
                }

                const ord = fromJSON(this._client, body);
                if (!(ord instanceof Order)) {
                    reject(ord);
                    return;
                }

                resolve(ord);
            })
            .catch(reject);
        });
    }

    downloadResource(id: string): Promise<string> {
        return resourceDownloader(this._client, id);
    }
}
