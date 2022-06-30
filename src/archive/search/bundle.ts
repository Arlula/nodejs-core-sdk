// decodeBundle is a helper for reading results from JSON, it is not intended for public use
export function decodeBundle(json: unknown): BundleOption|null {
    let key = "";
    const bands: string[] = [];
    let price = 0;

    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    if (argMap?.key && typeof argMap.key == "string") {
        key = argMap.key;
    }

    if (argMap?.bands && Array.isArray(argMap.bands)) {
        argMap.bands.forEach((ent) => {
            if (typeof ent == "string") {
                bands.push(ent);
            }
        });
    }

    if (argMap?.price && typeof argMap.price == "number") {
        price = argMap.price;
    }

    if (!(key||bands||price)) {
        return null;
    }
    return {key, bands, price};
}

/**
 * BundleOption contains a a definition of a ordering option, and its associated pricing and deliverables information
 * Full details can be found on the API documentation
 * 
 * @see {https://arlula.com/documentation/#archive-search|Archive Search endpoint documentation}
 * or
 * @see {https://arlula.com/documentation/#ref-bundle|Archive Bundle structure reference}
 */
export default interface BundleOption {
    key: string;
    bands: string[];
    price: number;
}
