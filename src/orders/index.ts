import Order, { fromJSON } from "./order";
import { downloadHelper as resourceDownloader } from "./resource";
import { AxiosInstance } from "axios";
import { handleError } from "../util/error";

const listURL = "https://api.arlula.com/api/order/list";
const getURL = "https://api.arlula.com/api/order/get";

export default class Orders {
    private _client: AxiosInstance;
    constructor(client: AxiosInstance) {
        this._client = client;
    }

    ListOrders(): Promise<Order[]> {
        return this._client.get(listURL)
        .then((resp) => {
            if (resp.status < 200 || resp.status >= 300) {
                return Promise.reject(resp.data);
            }

            if (!Array.isArray(resp.data)) {
                return Promise.reject("Orders list response is not array");
            }

            const orders: Order[] = [];
            for (let i=0; i<resp.data.length; i++) {
                const ord = fromJSON(this._client, resp.data[i])
                if (!(ord instanceof Order)) {
                    return Promise.reject(ord);
                }
                orders.push(ord);
            }

            return orders;
        })
        .catch(handleError);
    }

    GetOrder(id: string): Promise<Order> {
        return this._client.get(getURL, {params: {id: id}})
        .then((resp) => {
            if (typeof resp.data !== "object") {
                return Promise.reject("Order is not an object");
            }

            const ord = fromJSON(this._client, resp.data);
            if (!(ord instanceof Order)) {
                return Promise.reject(ord);
            }
            return ord;
        })
        .catch(handleError);
    }

    downloadResource(id: string): Promise<ArrayBuffer> {
        return resourceDownloader(this._client, id);
    }
}
