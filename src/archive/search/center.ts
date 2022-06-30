// decodeCenter is a helper for reading results from JSON, it is not intended for public use
export function decodeCenter(json: unknown): Center|null {
    let lat = 0;
    let long = 0;

    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    if (argMap?.lat && typeof argMap.lat == "number") {
        lat = argMap.lat;
    }

    if (argMap?.long && typeof argMap.long == "number") {
        long = argMap.long;
    }

    if (!(lat||long)) {
        return null;
    }
    return {lat, long};
}

export default interface Center {
    lat: number;
    long: number;
}