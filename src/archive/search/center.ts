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

/**
 * Center is a lat long reference point that is the centre of a scene
 * Full details can be found on the API documentation
 * 
 * @see {https://arlula.com/documentation/#archive-search|Archive Search endpoint documentation}
 */
export default interface Center {
    long: number;
    lat: number;
}