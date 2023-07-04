import { requestBuilder } from "../util/request";

/**
 * @class Collections wraps the API requests to the imagery collection management API
 */
export default class Collections {
    private _client: requestBuilder;
    /**
     * creates a new collections API client
     * @constructor
     * @param {requestBuilder} client the initiated http transport for the API, created and initialized with credentials by the root Arlula client
     * 
     * @see {@link ../index|Arlula}
     */
    constructor(client: requestBuilder) {
        this._client = client;
    }
}