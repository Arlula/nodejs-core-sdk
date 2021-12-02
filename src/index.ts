import Archive from "./archive/index";
import Orders from "./orders/index";
import {authProvider, requestBuilder} from "./util/request";
import paths from "./util/paths";

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
    private readonly builder: requestBuilder;
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
        this.builder = authProvider(key, secret);
        this._archive = new Archive(this.builder);
        this._orders = new Orders(this.builder);
    }

    /**
     * tests connection to server by making an authenticated no-op request
     * determines if credentials are correctly configured
     * 
     * @returns {Promise<boolean>} Whether the requests authentication was successful, error message will be passed to rejection
     */
    test(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.builder("GET", paths.Test)
            .then((res) => {
                if (res.ok) {
                    resolve(res.ok);
                    return
                }
                res.text()
                .then((msg) => {
                    reject(msg)
                })
            })
            .catch((e) => {
                reject(e)
            })
        })
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
