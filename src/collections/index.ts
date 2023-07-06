import { jsonOrError, requestBuilder } from "../util/request";

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

    // conformance
    conformance(): void {
        // 
    }
    // list
    list(): void {
        // 
    }
    // get
    get(): void {
        // 
    }
    // create
    create(): void {
        // 
    }
    // update
    update(): void {
        // 
    }
    // delete
    delete(): void {
        // 
    }
    
    // itemsList
    itemsList(): void {
        // 
    }
    // itemsSearch
    itemsSearch(): void {
        // 
    }
    // itemGet
    itemGet(): void {
        // 
    }
    // itemAdd
    itemAdd(): void {
        // 
    }
    // itemRemove
    itemRemove(): void {
        // 
    }
}