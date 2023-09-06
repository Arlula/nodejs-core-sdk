
export const validWKTPolygon = /^\w+\s*\(+[+|-]?\d$/;

export default function parsePoly(poly: number[][][]|string): number[][][] {
    if (Array.isArray(poly)) {
        return poly;
    }

    if (!/^polygon\s*\(/i.test(poly)) {
        throw("polygon WKT is not a valid format");
    }

    // remove header
    poly = poly.substring(7);
    while (poly[0] == ' ') {
        poly = poly.substring(1);
    }

    // remove ring wrapper
    poly = poly.substring(1,poly.length-1);
    poly = poly.replace("(", "");

    const polygon: number[][][] = [];

    const ringTokens = poly.split(")");
    while (ringTokens.length) {
        const ringStr = ringTokens.shift();
        const ring: number[][] = [];
        if (!ringStr) {
            break;
        }

        const points = ringStr.split(",");

        while (points.length) {
            const pointStr = points.shift();
            const point: number[] = [];
            if (!pointStr) {
                break;
            }

            const vals = pointStr.split(" ");

            while (vals.length) {
                const val = vals.shift();
                if (!val) {
                    continue;
                }

                point.push(parseFloat(val));
            }

            ring.push(point);
        }

        polygon.push(ring);
    }

    return polygon
}