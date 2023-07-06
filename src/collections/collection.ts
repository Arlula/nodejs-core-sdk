
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
    private _assets: {[key: string]: Asset};
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
        assets: {[key: string]: Asset},
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
    public get assets(): {[key: string]: Asset} {
        return this._assets;
    }
}

export function decodeCollection(json: unknown): Collection|null {
    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    let id = "", type = "", version = "", title = "", description = "", license = "";
    let extensions: string[] = [], keywords: string[] = [];
    let providers: Provider[] = [];
    let extent: Extent = {spatial:{bbox: []}, temporal: {interval: []}};
    const summaries: {[key: string]: Summary} = {};
    const links: Link[] = [];
    const assets: {[key: string]: Asset} = {};

    // id
    if (argMap?.id && typeof argMap.id == "string") {
        id = argMap.id;
    }
    // type
    if (argMap?.type && typeof argMap.type == "string") {
        type = argMap.type;
    }
    // stacVersion
    if (argMap?.stac_version && typeof argMap.stac_version == "string") {
        version = argMap.stac_version;
    }
    // stacExtensions
    if (argMap?.stac_extensions && Array.isArray(argMap.stac_extensions)) {
        for (const r in argMap.stac_extensions) {
            if (typeof r !== "string") {
                throw("invalid collection extension, not string");
            }
        }
        extensions = argMap.stac_extensions;
    }
    // title
    if (argMap?.title && typeof argMap.title == "string") {
        title = argMap.title;
    }
    // description
    if (argMap?.description && typeof argMap.description == "string") {
        description = argMap.description;
    }
    // keywords
    if (argMap?.keywords && Array.isArray(argMap.keywords)) {
        for (const r in argMap.keywords) {
            if (typeof r !== "string") {
                throw("invalid collection keyword, not string");
            }
        }
        keywords = argMap.keywords;
    }
    // license
    if (argMap?.license && typeof argMap.license == "string") {
        license = argMap.license;
    }
    // providers
    if (argMap?.providers && Array.isArray(argMap.providers)) {
        providers = argMap.providers
    }
    // extent
    if (argMap?.extent) {
        const ext = decodeExtent(argMap.extent);
        if (!ext) {
            throw("Error parsing collection extent");
        }
        extent = ext;
    }
    // summaries
    if (argMap?.summaries && typeof argMap.summaries == "object") {
        for (const [key, value] of Object.entries(argMap.summaries)) {
            summaries[key] = new Summary(value);
        }
    }
    // links
    if (argMap?.links && Array.isArray(argMap.links)) {
        for (let i=0; i<argMap.links.length; i++) {
            const ln = decodeLink(argMap.links[i])
            if (!ln) {
                throw("Error parsing collection link");
            }
            links.push(ln);
        }
    }
    // assets
    if (argMap?.assets && typeof argMap.assets == "object") {
        for (const [key, value] of Object.entries(argMap.assets)) {
            const as = decodeAsset(value);
            if (!as) {
                throw("Error parsing collection asset: "+key);
            }
            assets[key] = as;
        }
    }

    return new Collection(id, type, version, extensions, title, description, keywords, license, providers, extent, summaries, links, assets);
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

export function decodeProvider(json: unknown): Provider|null {
    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    let name = "", description = "", url = "";
    let roles: string[] = [];

    // name
    if (argMap?.name && typeof argMap.name == "string") {
        name = argMap.name;
    }
    // description
    if (argMap?.description && typeof argMap.description == "string") {
        description = argMap.description;
    }
    // roles
    if (argMap?.roles && Array.isArray(argMap.roles)) {
        for (const r in argMap.roles) {
            if (typeof r !== "string") {
                throw("invalid provider role, not string");
            }
        }
        roles = argMap.roles;
    }
    // url
    if (argMap?.url && typeof argMap.url == "string") {
        url = argMap.url;
    }
    return new Provider(name, description, roles, url);
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

export function decodeExtent(json: unknown): Extent|null {
    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};
    const spatial: BBOX[] = [];
    const temporal: Date[][] = [];

    // spatial
    if (argMap?.spatial && typeof argMap.spatial == "object") {
        if ('bbox' in argMap.spatial && Array.isArray(argMap.spatial.bbox)) {
            for (let i=0; i<argMap.spatial.bbox.length; i++) {
                const box = decodeBBOX(argMap.spatial.bbox[i])
                if (!box) {
                    throw("Invalid spatial extent, invalid bbox");
                }
                spatial.push(box);
            }
        }
    }
    // temporal
    if (argMap?.temporal && typeof argMap.temporal == "object") {
        if ('interval' in argMap.temporal && Array.isArray(argMap.temporal.interval)) {
            for (let i=0; i<argMap.temporal.interval.length; i++) {
                const interval: Date[] = [];
                for (let j=0; j<argMap.temporal.interval[i].length; j++) {
                    interval.push(new Date(argMap.temporal.interval[i][j]));
                }
                temporal.push(interval);
            }
        }
    }

    return new Extent(spatial, temporal);
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

export function decodeLink(json: unknown): Link|null {
    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    let href = "", rel = "", type = "", title = "";

    // href
    if (argMap?.href && typeof argMap.href == "string") {
        href = argMap.href;
    }
    // rel
    if (argMap?.rel && typeof argMap.rel == "string") {
        rel = argMap.rel;
    }
    // type
    if (argMap?.type && typeof argMap.type == "string") {
        type = argMap.type;
    }
    // title
    if (argMap?.title && typeof argMap.title == "string") {
        title = argMap.title;
    }
    
    return new Link(href, rel, type, title);
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

export function decodeAsset(json: unknown): Asset|null {
    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    let href = "", title = "", description = "", type = "";
    let roles: string[] = [];
    let created = new Date();

    // href
    if (argMap?.href && typeof argMap.href == "string") {
        href = argMap.href;
    }
    // title
    if (argMap?.title && typeof argMap.title == "string") {
        title = argMap.title;
    }
    // description
    if (argMap?.description && typeof argMap.description == "string") {
        description = argMap.description;
    }
    // type
    if (argMap?.type && typeof argMap.type == "string") {
        type = argMap.type;
    }
    // roles
    if (argMap?.roles && Array.isArray(argMap.roles)) {
        for (const r in argMap.roles) {
            if (typeof r !== "string") {
                throw("invalid asset role, not string");
            }
        }
        roles = argMap.roles;
    }
    // created
    if (argMap?.created && typeof argMap.created == "string") {
        created = new Date(argMap.created);
    }

    return new Asset(href, title, description, type, roles, created);
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

export function decodeBBOX(json: unknown): BBOX|null {
    if (!(Array.isArray(json))) {
        return null;
    }

    if (json.length != 4) {
        return null
    }

    if (typeof json[0] !== "number") {
        return null;
    }

    if (typeof json[1] !== "number") {
        return null;
    }

    if (typeof json[2] !== "number") {
        return null;
    }

    if (typeof json[3] !== "number") {
        return null;
    }

    return new BBOX([json[0], json[1], json[2], json[3]]);
}
