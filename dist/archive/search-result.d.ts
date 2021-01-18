export default interface SearchResult {
    supplier: string;
    eula: string;
    id: string;
    sceneID: string;
    date: Date;
    center: {
        lat: number;
        long: number;
    };
    bounding: number[][];
    area: number;
    overlap: {
        area: number;
        percent: {
            scene: number;
            search?: number;
        };
        polygon: number[][];
    };
    price: {
        base: number;
        seats?: {
            min: number;
            max: number;
            additional: number;
        }[];
    };
    fulfillment: number;
    resolution: number;
    thumbnail: string;
    cloud: number;
    annotations: string[];
}
