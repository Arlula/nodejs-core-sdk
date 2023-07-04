
export default class Collection {
    private _id: string;
    private _type: string;
    private _stacVersion: string;
    private _stacExtensions: string[];
    private _title: string;
    private _description: string;
    private _keywords: string[];
    private _license: string;
    private _providers: Provider[];
    private _extent: Extent;
    private _summaries: {[key: string]: Summary};
    private _links: Link[];
    private _assets: {[key: string]: Asset}[];
    constructor(
        id: string,
        type: string,
        version: string,
        extensions: string[],
        title: string,
        description: string,
        keywords: string[],
        license: string,
        providers: Provider[],
        extent: Extent,
        summaries: {[key: string]: Summary},
        links: Link[],
        assets: {[key: string]: Asset}[],
        ) {
            this._id = id;
            this._type = type;
            this._stacVersion = version;
            this._stacExtensions = extensions;
            this._title = title;
            this._description = description;
            this._keywords = keywords;
            this._license = license;
            this._providers = providers;
            this._extent = extent;
            this._summaries = summaries;
            this._links = links;
            this._assets = assets;
    }

    public get id(): string {
        return this._id;
    }
    public get type(): string {
        return this._type;
    }
    public get stacVersion(): string {
        return this._stacVersion;
    }
    public get stacExtensions(): string[] {
        return this._stacExtensions;
    }
    public get title(): string {
        return this._title;
    }
    public get description(): string {
        return this._description;
    }
    public get keywords(): string[] {
        return this._keywords;
    }
    public get license(): string {
        return this._license;
    }
    public get providers(): Provider[] {
        return this._providers;
    }
    public get extent(): Extent {
        return this._extent;
    }
    public get summaries(): {[key: string]: Summary} {
        return this._summaries;
    }
    public get links(): Link[] {
        return this._links;
    }
    public get assets(): {[key: string]: Asset}[] {
        return this._assets;
    }
}

export class Provider {
    private _name: string;
    private _description: string;
    private _roles: string[];
    private _url: string;
    constructor(name: string, description: string, roles: string[], url: string) {
        this._name = name;
        this._description = description;
        this._roles = roles;
        this._url = url;
    }

    public get name(): string {
        return this._name;
    }
    public get description(): string {
        return this._description;
    }
    public get roles(): string[] {
        return this._roles;
    }
    public get url(): string {
        return this._url;
    }
}

export class Extent {
    public spatial: {
        bbox: BBOX[];
    };
    public temporal: {
        interval: Date[][];
    };
    constructor(spatial: BBOX[], temporal: Date[][]) {
        this.spatial = {bbox: spatial};
        this.temporal = {interval: temporal};
    }
}

export class Summary {
    private _type: string;
    private _min?: any;
    private _max?: any;
    private _values?: any[];
    private _schema?: any;
    constructor(json: unknown) {
        if (Array.isArray(json)) {
            this._type = "enumeration";
            this._values = json;
        } else {
            if (!json || typeof json !== "object") {
                throw("");
            }
            if ('type' in json) {
                this._type = "schema";
                this._schema = json;
            } else if ('minimum' in json && 'maximum' in json) {
                this._type = "range";
                this._min = json.minimum;
                this._max = json.maximum;
            } else {
                this._type = "unknown";
            }
        }
    }

    public get type(): string {
        return this._type;
    }
    public get min(): any|undefined {
        return this._min;
    } 
    public get max(): any|undefined {
        return this._max;
    } 
    public get range(): any[]|undefined {
        if (this._min && this._max) {
            return [this._min, this._max];
        }
        return undefined;
    }
    public get values(): any|undefined {
        return this._values;
    } 
    public get schema(): any|undefined {
        return this._schema;
    }

}

export class Link {
    private _href: string
    private _rel: string
    private _type: string
    private _title: string
    constructor(href: string, rel: string, type: string, title: string) {
        this._href = href;
        this._rel = rel;
        this._type = type;
        this._title = title;
    }

    public get href(): string {
        return this._href;
    }
    public get rel(): string {
        return this._rel;
    }
    public get type(): string {
        return this._type;
    }
    public get title(): string {
        return this._title;
    }
}

export class Asset {
    private _href: string;
    private _title: string;
    private _description: string;
    private _type: string;
    private _roles: string[];
    private _created: Date;
    constructor(href: string, title: string, description: string, type: string, roles: string[], created: Date) {
        this._href = href;
        this._title = title;
        this._description = description;
        this._type = type;
        this._roles = roles;
        this._created = created;
    }

    public get href(): string {
        return this._href;
    }
    public get title(): string {
        return this._title;
    }
    public get description(): string {
        return this._description;
    }
    public get type(): string {
        return this._type;
    }
    public get roles(): string[] {
        return this._roles;
    }
    public get created(): Date {
        return this._created;
    }
}

export class BBOX {
    private _box: number[];
    constructor(bounds: number[]) {
        this._box = bounds;
    }

    public get bounds(): number[] {
        return this._box;
    }

    // TODO: helpers for working if polygon is within/intersects the bbox
}
