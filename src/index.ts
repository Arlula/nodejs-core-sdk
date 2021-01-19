import Archive from "./archive/index";
import Orders from "./orders/index";
import axios, { AxiosInstance } from "axios";

const testURL = "https://api.arlula.com/api/test";

export default class Arlula {
    private _client: AxiosInstance
    private _archive: Archive;
    private _orders: Orders;

    constructor(key: string, secret: string) {
        this._client = axios.create({
            method: "GET",
            auth: {
                username: key,
                password: secret,
            },
            timeout: 10000,
            responseType: "json",
            headers: {"User-Agent": "arlula-js 1.0.0, API-ver 2020-12, " + getPlatformUserAgentFragment()},
        });
        this._archive = new Archive(this._client);
        this._orders = new Orders(this._client);
    }

    test(): Promise<boolean> {
        return this._client.get(testURL)
        .then((resp) => {
            return resp.status >= 200 && resp.status < 300; 
        })
        .catch(() => {
            return false;
        });
    }

    archive(): Archive {
        return this._archive;
    }

    orders(): Orders {
        return this._orders;
    }
}

function getPlatformUserAgentFragment(): string {
    if (process) {
        // is node
        return `server nodejs ${process.version}; ${process.arch} ${process.platform}`;
    }
    // in browser
    return "client, user-agent: "+navigator.userAgent;
}
