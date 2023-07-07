import { voidOrError, jsonOrError, requestBuilder } from "../util/request";
import paths from "../util/paths";
import Collection, { Link, decodeCollection, decodeLink } from "./collection";
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

    /**
     * check for extension conformance of the API
     * 
     * @returns {Promise<ConformanceResponse>} The list of extension schema's conformant with
     * 
     * TODO: reference web API documentation
     */
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
    
    /**
     * list collections the API has access too
     * 
     * @returns {Promise<CollectionList>} the list of collections the api may access 
     * 
     * TODO: reference web API documentation
     */
    list(): Promise<CollectionList> {
        return this._client("POST", paths.CollectionList)
        .then(jsonOrError)
        .then((resp) => {
            return decodeCollectionList(resp)
        });
    }
    
    /**
     * retrieve a collection object, with its description, extent and summary information
     * 
     * @returns {Promise<Collection>} the collection itself
     * 
     * TODO: reference web API documentation
     */
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
    
    /**
     * create a new collection
     * 
     * @returns {Promise<Collection>} the collection created
     * WARNING: the extent and summary will be unset until the first item is added
     * 
     * TODO: reference web API documentation
     */
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
    
    /**
     * update the collections details such as its title, description or keywords
     * 
     * @returns {Promise<void>} none if successful
     * 
     * TODO: reference web API documentation
     */
    update(collectionID: string, title: string, description: string, keywords: string[]): Promise<void> {
        return this._client("POST", paths.CollectionUpdate(collectionID), {title,description,keywords})
        .then(voidOrError);
    }
    
    /**
     * delete a collection
     * 
     * @returns {Promise<void>} none if successful
     * 
     * TODO: reference web API documentation
     */
    delete(collectionID: string): Promise<void> {
        return this._client("DELETE", paths.CollectionDelete(collectionID))
        .then(voidOrError);
    }
    
    /**
     * list items in the collection subject to some simple constraints
     * 
     * @returns {Promise<ItemList>} the list of items found in the collection
     * 
     * TODO: reference web API documentation
     */
    itemsList(collectionID: string): Promise<ItemList> {
        return this._client("GET", paths.CollectionItemsList(collectionID))
        .then(jsonOrError)
        .then((resp) => {
            return decodeItemList(resp);
        });
    }
    
    /**
     * perform a search of items within the collection that satisfy a set of conditions
     * 
     * @returns {Promise<SearchResults>} the list of items found matching the conditions
     * 
     * TODO: reference web API documentation
     */
    itemsSearch(collectionID: string): Promise<SearchResults> {
        return this._client("GET", paths.CollectionItemsSearch(collectionID))
        .then(jsonOrError)
        .then((resp) => {
            return decodeSearchResults(resp);
        });
    }
    
    /**
     * retrieve an individual item from the collection
     * 
     * @returns {Promise<Item>} The item from the collection
     * 
     * TODO: reference web API documentation
     */
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
    
    /**
     * request an order be added to the collection
     * NOTE: this operation is asynchronous, return of this endpoint indicates
     * that the request has been submitted, but it may take several seconds for the
     * corresponding item to become available.
     * 
     * @returns {Promise<void>} none if successfully scheduled
     * 
     * TODO: reference web API documentation
     */
    itemAdd(collectionID: string, orderID: string): Promise<void> {
        return this._client("POST", paths.CollectionItemAdd(collectionID), {order: orderID})
        .then(voidOrError);
    }
    
    /**
     * request to remove an item from the collection
     * NOTE: this operation is asynchronous, return of this endpoint indicates
     * that the request has been submitted, but it may take several seconds for the
     * corresponding item be removed and the collections summary to be updated.
     * 
     * @returns {Promise<void>} none if successfully scheduled
     * 
     * TODO: reference web API documentation
     */
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

function decodeCollectionList(json: unknown): CollectionList {
    const res: CollectionList = {collections: [], links: [], context: {}}

    if (typeof json !== "object") {
        return res;
    }
    const argMap = json as {[key: string]: unknown};

    if (argMap.collections && Array.isArray(argMap.collections)) {
        for (let i=0; i<argMap.collections.length; i++) {
            const c = decodeCollection(argMap.collections[i]);
            if (!c) {
                throw("invalid collection list response, error decoding collection");
            }
            res.collections.push(c);
        }
    }

    if (argMap.links && Array.isArray(argMap.links)) {
        for (let i=0; i<argMap.links.length; i++) {
            const l = decodeLink(argMap.links[i]);
            if (!l) {
                throw("invalid collection list response, error decoding link");
            }
            res.links.push(l);
        }
    }

    if (argMap.context) {
        res.context = decodeContext(argMap.context);
    }

    return res;
}

export interface ItemList {
    type:           string;
    features:       Item[];
    links:          Link[];
    timeStamp:      Date;
    numberMatched:  number;
    numberReturned: number;
}

function decodeItemList(json: unknown): ItemList {
    const res: ItemList = {
        type: "FeatureCollection",
        features: [],
        links: [],
        timeStamp: new Date(),
        numberMatched: 0,
        numberReturned: 0,
    };

    if (typeof json !== "object") {
        return res;
    }
    const argMap = json as {[key: string]: unknown};

    if (argMap.type && typeof argMap.type === "string") {
        res.type = argMap.type;
    }
    if (argMap.features && Array.isArray(argMap.features)) {
        for (let i=0; i<argMap.features.length; i++) {
            const f = decodeItem(argMap.features[i]);
            if (!f) {
                throw("invalid item list response, error decoding item");
            }
            res.features.push(f);
        }
    }
    if (argMap.links && Array.isArray(argMap.links)) {
        for (let i=0; i<argMap.links.length; i++) {
            const l = decodeLink(argMap.links[i]);
            if (!l) {
                throw("invalid item list response, error decoding link");
            }
            res.links.push(l);
        }
    }
    if (argMap.timeStamp && typeof argMap.timeStamp === "string") {
        res.timeStamp = new Date(argMap.timeStamp);
    }
    if (argMap.numberMatched && typeof argMap.numberMatched === "number") {
        res.numberMatched = argMap.numberMatched;
    }
    if (argMap.numberReturned && typeof argMap.numberReturned === "number") {
        res.numberReturned = argMap.numberReturned;
    }

    return res;
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

function decodeSearchResults(json: unknown): SearchResults {
    const res: SearchResults = {
        type: "FeatureCollection",
        stac_version: "",
        stac_extensions: [],
        context: {},
        numberMatched: 0,
        numberReturned: 0,
        links: [],
        features: [],
    };

    if (typeof json !== "object") {
        return res;
    }
    const argMap = json as {[key: string]: unknown};

    if (argMap.type && typeof argMap.type === "string") {
        res.type = argMap.type;
    }
    if (argMap.stac_version && typeof argMap.stac_version === "string") {
        res.stac_version = argMap.stac_version;
    }
    if (argMap.stac_extensions && Array.isArray(argMap.stac_extensions)) {
        res.stac_extensions = argMap.stac_extensions;
    }
    if (argMap.context) {
        res.context = decodeContext(argMap.context);
    }
    if (argMap.numberMatched && typeof argMap.numberMatched === "number") {
        res.numberMatched = argMap.numberMatched;
    }
    if (argMap.numberReturned && typeof argMap.numberReturned === "number") {
        res.numberReturned = argMap.numberReturned;
    }
    if (argMap.links && Array.isArray(argMap.links)) {
        for (let i=0; i<argMap.links.length; i++) {
            const l = decodeLink(argMap.links[i]);
            if (!l) {
                throw("invalid item search response, error decoding link");
            }
            res.links.push(l);
        }
    }
    if (argMap.features && Array.isArray(argMap.features)) {
        for (let i=0; i<argMap.features.length; i++) {
            const f = decodeItem(argMap.features[i]);
            if (!f) {
                throw("invalid item search response, error decoding item");
            }
            res.features.push(f);
        }
    }

    return res;
}

export interface queryContext {
    page?:     number;
    limit?:    number;
    matched?:  number;
    returned?: number;
}

function decodeContext(json: unknown): queryContext {
    const res: queryContext = {};

    if (typeof json !== "object") {
        return res;
    }
    const argMap = json as {[key: string]: unknown};

    if (argMap.page && typeof argMap.page === "number") {
        res.page = argMap.page;
    }

    if (argMap.limit && typeof argMap.limit === "number") {
        res.limit = argMap.limit;
    }

    if (argMap.matched && typeof argMap.matched === "number") {
        res.matched = argMap.matched;
    }

    if (argMap.returned && typeof argMap.returned === "number") {
        res.returned = argMap.returned;
    }

    return res;
}
