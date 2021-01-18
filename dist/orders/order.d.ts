import { AxiosInstance } from "axios";
import Resource from "./resource";
export declare function fromJSON(client: AxiosInstance, json: string | {
    [key: string]: any;
}): Order | string;
export default class Order {
    private _client;
    private _id;
    private _createdAt;
    private _updatedAt;
    private _supplier;
    private _imageryID;
    private _sceneID;
    private _status;
    private _total;
    private _type;
    private _expiration?;
    private _resources;
    private detailed;
    constructor(client: AxiosInstance, id: string, created: Date, updated: Date, supplier: string, imgID: string, scene: string, status: OrderStatus, total: number, type: string, resources: Resource[], exp?: Date);
    get id(): string;
    get createdAt(): Date;
    get updatedAt(): Date;
    get supplier(): string;
    get imageryID(): string;
    get sceneID(): string;
    get status(): OrderStatus;
    get total(): number;
    get type(): string;
    get expiration(): Date | null;
    get resources(): Resource[];
    loadResources(): Promise<Resource[]>;
}
export declare enum OrderStatus {
    New = "created",
    Pending = "pending",
    Manual = "processing",
    Custom = "manual",
    Processing = "post-processing",
    Complete = "complete"
}
