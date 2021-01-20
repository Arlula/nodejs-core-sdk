import Archive from "./archive/index";
import Orders from "./orders/index";
/**
 * @class Arlula is the root client for connecting to the Arlula API
 *  initializing it creates a client that can be used to test the connection
 * or to instantiate a client for the respective sub API.
 *
 * Currently this client supports the
 *  - Archive imagery API `archive`
 *  - Order management API `orders`
 */
export default class Arlula {
    private _client;
    private _archive;
    private _orders;
    /**
     * create a new client connection to the Arlula API
     *
     * @constructor
     * @author Scott Owens
     *
     * @param {string} key    The API users API Key
     * @param {string} secret The API users API Secret
     */
    constructor(key: string, secret: string);
    /**
     * tests connection to server by making an authenticated no-op request
     * determines if credentials are correctly configured
     *
     * @returns {Promise<boolean>} Whether the requests authentication was successful
     */
    test(): Promise<boolean>;
    /**
     * accesses the archive API client
     *
     * @returns {Archive} the archive API client
     *
     * @see {@link ./archive|Archive}
     */
    archive(): Archive;
    /**
     * accesses the orders API client
     *
     * @returns {Orders} the orders API client
     *
     * @see {@link ./orders|Orders}
     */
    orders(): Orders;
}
