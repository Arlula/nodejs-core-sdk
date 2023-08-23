
export function decodeMultiPolygon(json: unknown): number[][][][]|null {
    const result: number[][][][] = [];

    if (!Array.isArray(json)) {
        return null;
    }

    for (let i=0; i<json.length; i++) {
        const p = decodePolygon(json[i])
        if (p) {
            result.push(p);
            continue;
        }
        return null;
    }

    return result;
}
/**
 * decodePolygon reads a depth 2 or 3 JSON polygon coordinates.
 * It returns the polygon or null if any issues were found while decoding.
 * This is a helper for reading results from JSON, it is not intended for public use.
 */ 
export default function decodePolygon(json: unknown): number[][][]|null {

    const result: number[][][] = [];

    if (!Array.isArray(json)) {
        return null;
    }
    const pseudoLoop: number[][] = [];

    for (let i=0; i<json.length; i++) {
        const l = decodeLoop(json[i])
        if (l) {
            result.push(l);
            continue;
        }
        const p = decodePoint(json[i]);
        if (p) {
            pseudoLoop.push(p);
            continue;
        }
        return null
    }

    if (pseudoLoop.length) {
        result.push(pseudoLoop);
    }

    return result;
}

function decodeLoop(loop: unknown[]): number[][]|null {
    const result: number[][] = [];

    for (let i=0; i<loop.length; i++) {
        const point = loop[i];
        if (!Array.isArray(point)) {
            return null;
        }
        const p = decodePoint(point)
        if (!p) {
            return null;
        }
        result.push(p);
    }

    return result;
}

function decodePoint(point: unknown[]): number[]|null {
    if (point.length < 2) {
        return null;
    }

    if (typeof point[0] !== "number") {
        return null;
    }

    if (typeof point[1] !== "number") {
        return null;
    }

    return [point[0], point[1]]
}