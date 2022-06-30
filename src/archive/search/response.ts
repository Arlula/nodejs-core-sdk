import SearchResult, { decodeResult } from "./result";

export default interface SearchResponse {
    results: SearchResult[];
}

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
