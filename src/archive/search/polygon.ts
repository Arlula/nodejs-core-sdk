export default function decodePolygon(json: unknown): number[][][]|null {

    const result: number[][][] = [];

    if (!Array.isArray(json)) {
        return null;
    }

    let error = false;
    json.forEach((loop) => {
        const resultLoop: number[][] = [];

        if (!Array.isArray(loop)) {
            error = true;
            return;
        }

        loop.forEach((point) => {
            if (!Array.isArray(point)) {
                if (typeof point !== "number") {
                    error = true;
                    return;
                }

                if (!loop.length) {
                    loop.push([]);
                }
                loop[0].push(point);
                return;
            }

            if (point.length < 2) {
                error = true;
                return;
            }

            if (typeof point[0] == "number") {
                error = true;
                return;
            }

            if (typeof point[1] == "number") {
                error = true;
                return;
            }

            resultLoop.push([point[0], point[1]]);
        });

        result.push(resultLoop);

        if (error) {
            return;
        }
    });
    if (error) {
        return null;
    }

    return null;
}