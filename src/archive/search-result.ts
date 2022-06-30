

export interface SearchResponse {
    results: SearchResult[];
}

/**
 * SearchResult contains information on a scene that may be ordered through the archive API
 * full details can be found in the Arlula Documentation
 * 
 * @see {https://arlula.com/documentation/#archive-search|Archive Search endpoint documentation}
 * or
 * @see {https://arlula.com/documentation/#ref-search-result|Archive Search result structure reference}
 */
export default interface SearchResult {
    sceneID: string;
    supplier: string;
    platform: string;
    date: Date;
    thumbnail: string;
    cloud: number;
    offNadir: number;
    gsd: number;
    bands: Band[];
    area: number;
    center: {
        lat: number;
        long: number;
    };
    bounding: number[][][];
    overlap: {
        area: number;
        percent: {
            scene: number;
            search?: number;
        },
        polygon: number[][][];
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
    orderingID: string;
    bundles: BundleOption[];
    license: License[];
    annotations: string[];
}

export interface Band {
    name: string;
    id: string;
    min: number;
    max: number;
}

export interface BundleOption {
    key: string;
    bands: string[];
    price: number;
}

export interface License {
    name: string;
    href: string;
    loadingPercent: number;
    loadingAmount: number;
}
