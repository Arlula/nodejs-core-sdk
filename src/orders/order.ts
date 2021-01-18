import Resource, {fromJSON as resourceFromJSON} from "./resource";
import { client, request } from "../util/client";

export function fromJSON(client: client, json: string|{[key: string]: any}): Order|string {
    if (typeof json === "string") {
        json = JSON.parse(json);
    }

    if (!(json instanceof Object)) {
        return "JSON does not correspond to an Order object";
    }

    if (typeof json.id !== "string") {
        return "No ID for order";
    }
    if (typeof json.createdAt !== "string") {
        return "No creation date for order";
    }
    if (typeof json.updatedAt !== "string") {
        return "No update date for order";
    }
    if (typeof json.supplier !== "string") {
        return "Order supplier missing";
    }
    if (typeof json.imageryID !== "string") {
        return "Imagery ID missing from Order";
    }
    if (typeof json.sceneID !== "string") {
        return "Scene ID missing form Order";
    }
    if (typeof json.status !== "string") {
        return "Order status missing";
    }
    if (!isOrderStatus(json.status)) {
        return `Order status '${json.status}' not recognized`;
    }
    if (typeof json.total !== "number") {
        return "Order total missing";
    }
    if (typeof json.type !== "string") {
        return "Order type missing";
    }
    if (json.expiration && !(typeof json.expiration === "string" || json.expiration instanceof Date)) {
        return "Order Expiration invalid formatting";
    }

    let resources: Resource[] = [];
    if (json.resources && Array.isArray(json.resources)) {
        for (let i=0; i<json.resources.length; i++) {
            const res = resourceFromJSON(client, json.resources[i]);
            if (res instanceof Resource) {
                resources.push(res);
                continue;
            }
            return res;
        }
    }

    return new Order(client, json.id, new Date(json.createdAt), new Date(json.updatedAt), json.supplier, json.imageryID, json.sceneID, json.status, json.total, json.type, resources, json.expiration?new Date(json.expiration):undefined);
}

export default class Order {
    private _client: client;
    private _id: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _supplier: string;
    private _imageryID: string;
    private _sceneID: string;
    private _status: OrderStatus;
    private _total: number;
    private _type: string;
    private _expiration?: Date;
    private _resources: Resource[] = [];
    private detailed: boolean = false;
    constructor(client: client, id: string, created: Date, updated: Date, supplier: string, imgID: string, scene: string, status: OrderStatus, total: number, type: string, resources: Resource[], exp?: Date) {
        this._client = client;
        this._id = id;
        this._createdAt = created;
        this._updatedAt = updated;
        this._supplier = supplier;
        this._imageryID = imgID;
        this._sceneID = scene;
        this._status = status;
        this._total = total;
        this._type = type;
        this._expiration = exp;
        this._resources = resources;
        if (this.resources.length) {
            this.detailed = true;
        }
    }

    // public getters

    public get id(): string {
        return this._id;
    }
    public get createdAt(): Date {
        return this._createdAt;
    }
    public get updatedAt(): Date {
        return this._updatedAt;
    }
    public get supplier(): string {
        return this._supplier;
    }
    public get imageryID(): string {
        return this._imageryID;
    }
    public get sceneID(): string {
        return this._sceneID;
    }
    public get status(): OrderStatus {
        return this._status;
    }
    public get total(): number {
        return this._total;
    }
    public get type(): string {
        return this._type;
    }
    public get expiration(): Date|null {
        if (this._expiration) {
            return this._expiration;
        }
        return null;
    }
    public get resources(): Resource[] {
        return this._resources;
    }

    loadResources(): Promise<Resource[]> {
        if (this.status !== OrderStatus.Complete) {
            return Promise.resolve(this._resources);
        }

        if (this.detailed) {
            return Promise.resolve(this._resources);
        }

        return new Promise((resolve, reject) => {
            const req = new request(getURL);
            req.addParam("id", this._id);
            this._client.do(req)
            .then((resp) => {
                if (!resp.ok()) {
                    reject(resp.text());
                    return;
                }

                const body = resp.json();
                if (typeof body !== "object") {
                    reject("Order response is not an object");
                    return;
                }
                if (!("resources" in body)) {
                    // order has no resources
                    this.detailed = true;
                    resolve([]);
                    return;
                }
                
                if (!Array.isArray(body.resources)) {
                    reject("Resources is not an array");
                    return;
                }

                const resources: Resource[] = [];
                for (let i=0; i<body.resources.length; i++) {
                    const res = resourceFromJSON(this._client, body.resources[i]);
                    if (!(res instanceof Resource)) {
                        // error in decoding, pass error up the chain
                        reject(res);
                        return;
                    }
                    resources.push(res);
                };

                this.detailed = true;
                this._resources = resources;
                resolve(resources);
            })
            .catch(reject);
        });
    }

}

const getURL = "/api/order/get";

export enum OrderStatus {
    New        = "created",
    Pending    = "pending",
    Manual     = "processing",
    Custom     = "manual",
    Processing = "post-processing",
    Complete   = "complete",
}

function isOrderStatus(token: any): token is OrderStatus {
    return Object.values(OrderStatus).includes(token as OrderStatus);
};
