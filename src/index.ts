import Archive from "./archive/index";
import Orders from "./orders/index";
import paths from "./util/paths";
import axios, { AxiosInstance } from "axios";

/** 
 * @class Arlula is the root client for connecting to the Arlula API
 *  initializing it creates a client that can be used to test the connection
 * or to instantiate a client for the respective sub API.  
 * 
 * Currently this client supports the
 *  - Archive imagery API `archive`
 *  - Order management API `orders`
 * 
 * Full API documentation is available at
 * https://arlula.com/documentation/
 */
export default class Arlula {
    private _client: AxiosInstance
    private _archive: Archive;
    private _orders: Orders;

    /** 
     * create a new client connection to the Arlula API
     * 
     * @constructor
     * @author Scott Owens
     * 
     * @param {string} key    The API users API Key
     * @param {string} secret The API users API Secret
     */
    constructor(key: string, secret: string) {
        this._client = axios.create({
            method: "GET",
            auth: {
                username: key,
                password: secret,
            },
            timeout: 10000,
            headers: getPlatformHeaders(),
        });
        this._archive = new Archive(this._client);
        this._orders = new Orders(this._client);
    }

    /**
     * tests connection to server by making an authenticated no-op request
     * determines if credentials are correctly configured
     * 
     * @returns {Promise<boolean>} Whether the requests authentication was successful
     */
    test(): Promise<boolean> {
        return this._client.get(paths.Test)
        .then((resp) => {
            return resp.status >= 200 && resp.status < 300; 
        })
        .catch(() => {
            return false;
        });
    }

    /**
     * accesses the archive API client
     * 
     * @returns {Archive} the archive API client
     * 
     * @see {@link ./archive|Archive}
     */
    archive(): Archive {
        return this._archive;
    }

    /**
     * accesses the orders API client
     * 
     * @returns {Orders} the orders API client
     * 
     * @see {@link ./orders|Orders}
     */
    orders(): Orders {
        return this._orders;
    }
}

// utility to construct user agent string for node and browser environment
function getPlatformHeaders(): {[key: string]: string} {
    if (typeof process !== "undefined") {
        // is node
        return {
            "X-User-Agent": `arlula-js 1.0.0, API-ver 2020-12, server nodejs ${process.version}; ${process.arch} ${process.platform}`,
        };
    }
    // in browser
    return {
        "X-User-Agent": "arlula-js 1.0.0, API-ver 2020-12, client, user-agent: "+navigator.userAgent,
        "X-Download-Manual": "true",
    };
}
