import SearchResult, { decodeResult } from "./result";

/**
 * SearchResponse is a response envelope that includes the search result set
 * This envelope will be expanded in coming updates
 * 
 * @see {https://arlula.com/documentation/#archive-search|Archive Search endpoint documentation}
 * or
 * @see {https://arlula.com/documentation/#search-response|Archive Search Response}
 */
export default interface SearchResponse {
    // status: string;
    errors?: string[];
    // warnings: string[];
    results?: SearchResult[];
}

export function isResponse(object: unknown): object is SearchResponse {
    return !!object && (typeof object === "object") && ('errors' in object || 'results' in object);
}

// decodeResponse is a helper for reading results from JSON, it is not intended for public use.
export function decodeResponse(json: unknown): SearchResponse|null {
    let results: SearchResult[];

    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    if (argMap?.results && Array.isArray(argMap.results)) {
        const r = decodeResultSet(argMap.results);
        if (!r) {
            return null;
        }
        results = r;
    } else {
        return null;
    }

    return {results};
}

// decodeResultSet is a helper for reading results from JSON, it is not intended for public use.
export function decodeResultSet(json: unknown[]): SearchResult[]|null {
    const results: SearchResult[] = [];

    json.forEach((b) => {
        const r = decodeResult(b);
        if (r) {
            results.push(r);
        } else {
            return null;
        }
    });

    return results;
}