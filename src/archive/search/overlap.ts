import decodePolygon from "./polygon";

// decodeOverlap is a helper for reading results from JSON, it is not intended for public use
export function decodeOverlap(json: unknown): Overlap|null {
    let area = 0;
    let scene = 0;
    let search = 0;

    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    if (argMap?.area && typeof argMap.area == "number") {
        area = argMap.area;
    }

    if (argMap?.scene && typeof argMap.scene == "number") {
        scene = argMap.scene;
    }

    if (argMap?.search && typeof argMap.search == "number") {
        search = argMap.search;
    }

    if (!(argMap?.polygon)) {
        return null;
    }
    const polygon = decodePolygon(argMap.polygon)
    if (!polygon) {
        return null;
    }

    return {area, percent: {scene, search}, polygon};
}

/**
 * Overlap contains information about how a given scene overlaps with your search area and the polygon that will be delivered if the scene is ordered.
 * Full details can be found on the API documentation
 * 
 * @see {https://arlula.com/documentation/#archive-search|Archive Search endpoint documentation}
 * or
 * @see {https://arlula.com/documentation/#ref-overlap|Archive Overlap structure reference}
 */
export default interface Overlap {
    area: number;
    percent: {
        scene: number;
        search?: number;
    },
    polygon: number[][][];
}