import Archive from "./archive/index";
import Orders from "./orders/index";
import Collections from "./collections/index";
import {authProvider, requestBuilder} from "./util/request";
import paths from "./util/paths";
import Tasking from "./tasking";

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
    private _tasking: Tasking;
    private _orders: Orders;
    private _collections: Collections;

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
        this._tasking = new Tasking(this.builder);
        this._orders = new Orders(this.builder);
        this._collections = new Collections(this.builder);
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
                .then((msg: string) => {
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
     * accesses the tasking API client
     * 
     * @returns {Tasking} the tasking API client
     * 
     * @see {@link ./tasking|Tasking}
     */
    tasking(): Tasking {
        return this._tasking;
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

    /**
     * accesses the collections API client
     * 
     * @returns {Collections} the collections API client
     * 
     * @see {@link ./collections|Collections}
     */
    collections(): Collections {
        return this._collections;
    }
}
