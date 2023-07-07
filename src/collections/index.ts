import { voidOrError, jsonOrError, requestBuilder } from "../util/request";
import paths from "../util/paths";
import Collection, { Link, decodeCollection } from "./collection";
import Item, { decodeItem } from "./item";

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
    conformance(): Promise<ConformanceResponse> {
        return this._client("POST", paths.CollectionConformance)
        .then(jsonOrError)
        .then((resp) => {
            const res: ConformanceResponse = {conformsTo: []};
            if (typeof resp !== "object") {
                return res;
            }
            const body = resp as {[key: string]: unknown};
            
            if (body?.conformsTo && Array.isArray(body.conformsTo)) {
                res.conformsTo = body.conformsTo;
            }

            return res;
        });
    }
    // list
    list(): Promise<CollectionList> {
        return this._client("POST", paths.CollectionList)
        .then(jsonOrError)
        .then((resp) => {
            // TODO
        });
    }
    // get
    get(collectionID: string): Promise<Collection> {
        return this._client("POST", paths.CollectionGet(collectionID))
        .then(jsonOrError)
        .then((resp) => {
            const c = decodeCollection(resp);
            if (!c) {
                return Promise.reject("invalid promise response, decode error")
            }
            return c;
        });
    }
    // create
    create(title: string, description: string, keywords: string[], team?: string): Promise<Collection> {
        return this._client("POST", paths.CollectionCreate, {title,description,keywords,team})
        .then(jsonOrError)
        .then((resp) => {
            const c = decodeCollection(resp);
            if (!c) {
                return Promise.reject("invalid promise response, decode error")
            }
            return c;
        });
    }
    // update
    update(collectionID: string, title: string, description: string, keywords: string[]): Promise<void> {
        return this._client("POST", paths.CollectionUpdate(collectionID), {title,description,keywords})
        .then(voidOrError);
    }
    // delete
    delete(collectionID: string): Promise<void> {
        return this._client("DELETE", paths.CollectionDelete(collectionID))
        .then(voidOrError);
    }
    
    // itemsList
    itemsList(collectionID: string): Promise<ItemList> {
        return this._client("GET", paths.CollectionItemsList(collectionID))
        .then(jsonOrError)
        .then((resp) => {
            // TODO
        });
    }
    // itemsSearch
    itemsSearch(collectionID: string): Promise<SearchResults> {
        return this._client("GET", paths.CollectionItemsSearch(collectionID))
        .then(jsonOrError)
        .then((resp) => {
            // TODO
        });
    }
    // itemGet
    itemGet(collectionID: string, itemID: string): Promise<Item> {
        return this._client("GET", paths.CollectionItemGet(collectionID, itemID))
        .then(jsonOrError)
        .then((resp) => {
            const i = decodeItem(resp);
            if (!i) {
                return Promise.reject("invalid item response, decode error");
            }
            return i;
        });
    }
    // itemAdd
    itemAdd(collectionID: string, orderID: string): Promise<void> {
        return this._client("POST", paths.CollectionItemAdd(collectionID), {order: orderID})
        .then(voidOrError);
    }
    // itemRemove
    itemRemove(collectionID: string, orderID: string): Promise<void> {
        return this._client("DELETE", paths.CollectionItemRemove(collectionID, orderID))
        .then(voidOrError);
    }
}

export interface ConformanceResponse {
    conformsTo: string[];
}

export interface CollectionList {
    collections: Collection[];
    links:       Link[];
    context:     queryContext;
}

export interface ItemList {
    type:           string;
    features:       Item[];
    links:          Link[];
    timeStamp:      Date;
    numberMatched:  number;
    numberReturned: number;
}

export interface SearchResults {
    type:            string;
    stac_version:    string;
    stac_extensions: string[];
    context:         queryContext;
    numberMatched:   number;
    numberReturned:  number;
    links:           Link[];
    features:        Item[];
}

export interface queryContext {
    page?:     number;
    limit?:    number;
    matched?:  number;
    returned?: number;
}