import Archive from "./archive/index";
import Orders from "./orders/index";
import { client, request } from "./util/client";

const testURL = "/api/test";

export default class Arlula {
    private _client: client
    private _archive: Archive;
    private _orders: Orders;

    constructor(client: client) {
        this._client = client;
        this._archive = new Archive(this._client);
        this._orders = new Orders(this._client);
    }

    test(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const req = new request(testURL);
            this._client.do(req)
            .then((resp) => {
                resolve(resp.ok());
            })
            .catch(reject)
        });
    }

    archive(): Archive {
        return this._archive;
    }

    orders(): Orders {
        return this._orders;
    }
}
