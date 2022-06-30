import SearchResult, { decodeResult } from "./result";

export default interface SearchResponse {
    results: SearchResult[];
}

export function decodeResponse(json: unknown): SearchResponse|null {
    const results: SearchResult[] = [];

    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    if (argMap?.results && Array.isArray(argMap.results)) {
        argMap.results.forEach((b) => {
            const r = decodeResult(b);
            if (r) {
                results.push(r);
            } else {
                return null;
            }
        });
    } else {
        return null;
    }

    return {results};
}
