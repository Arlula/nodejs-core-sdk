

/**
 * SearchResult contains information on a scene that may be ordered through the archive API
 * full details can be found in the Arlula Documentation
 * 
 * @see {https://arlula.com/documentation/#archive-search|Archive Search endpoint documentation}
 * or
 * @see {https://arlula.com/documentation/#ref-search-result|Archive Search result structure reference}
 */
export default interface SearchResult {
    supplier: string;
    eula: string;
    id: string;
    sceneID: string;
    platform: string;
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
        },
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
    fulfillmentTime: number;
    resolution: number;
    thumbnail: string;
    cloud: number;
    offNadir: number;
    annotations: string[];
}
