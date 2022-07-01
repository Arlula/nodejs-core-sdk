import SearchResult, { decodeResult } from "./result";

/**
 * SearchResponse is a response envelope that includes the search result set
 * This envelope will be expanded in coming updates
 */
export default interface SearchResponse {
    // status: string;
    errors?: string[];
    // warnings: string[];
    results?: SearchResult[];
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
