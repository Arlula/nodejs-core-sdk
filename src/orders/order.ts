import paths from "../util/paths";
import { jsonOrError, requestBuilder } from "../util/request";
import Campaign, { fromJSON as campaignFromJSON } from "./campaign";
import Dataset, { fromJSON as datasetFromJSON } from "./dataset";
import { isStatusCode, StatusCode } from "./status";
import { parseListResponse } from "./lists"

export function fromJSON(client: requestBuilder, json: string|{[key: string]: unknown}): Order|string {
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
    if (typeof json.status !== "string") {
        return "Order status missing";
    }
    if (!isStatusCode(json.status)) {
        return `Order status '${json.status}' not recognized`;
    }
    if (typeof json.total !== "number") {
        return "Missing order total";
    }
    if (typeof json.discount !== "number") {
        return "Missing order discount";
    }
    if (typeof json.tax !== "number") {
        return "Missing order tax amount";
    }
    if (!json.refunded) {
        json.refunded = 0;
    }
    if (typeof json.refunded !== "number") {
        return "Missing order refunded amount"
    }
    let monitor = ""
    if (typeof json.monitor === "string") {
        monitor = json.monitor;
    }

    const campaigns: Campaign[] = [];
    if (json.resources && Array.isArray(json.campaigns)) {
        for (let i=0; i<json.campaigns.length; i++) {
            const res = campaignFromJSON(client, json.campaigns[i]);
            if (res instanceof Campaign) {
                campaigns.push(res);
                continue;
            }
            return res;
        }
    }

    const datasets: Dataset[] = [];
    if (json.resources && Array.isArray(json.datasets)) {
        for (let i=0; i<json.datasets.length; i++) {
            const res = datasetFromJSON(client, json.datasets[i]);
            if (res instanceof Dataset) {
                datasets.push(res);
                continue;
            }
            return res;
        }
    }

    return new Order(client, json.id, new Date(json.createdAt), new Date(json.updatedAt), json.status, json.total, json.discount, json.tax, json.refunded, monitor, [], []);
}

export default class Order {
    private _client: requestBuilder;
    private _id: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _status: StatusCode;
    private _total: number;
    private _discount: number;
    private _tax: number;
    private _refunded: number;
    private _monitor: string;
    private _campaigns: Campaign[];
    private _datasets: Dataset[];
    private _attemptedCampaigns = false;
    private _attemptedDatasets = false;
    constructor(
        client: requestBuilder,
        id: string,
        createdAt: Date,
        updatedAt: Date,
        status: StatusCode,
        total: number,
        discount: number,
        tax: number,
        refunded: number,
        monitor: string,
        campaigns: Campaign[],
        datasets: Dataset[],
    ) {
        this._client = client;
        this._id = id;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._status = status;
        this._total = total;
        this._discount = discount;
        this._tax = tax;
        this._refunded = refunded;
        this._monitor = monitor;
        this._campaigns = campaigns;
        this._datasets = datasets;
        this._attemptedCampaigns = this._campaigns.length > 0;
        this._attemptedDatasets = this._datasets.length > 0;
    }

    public get id(): string {return this._id}
    public get createdAt(): Date {return this._createdAt}
    public get updatedAt(): Date {return this._updatedAt}
    public get status(): StatusCode {return this._status}
    public get total(): number {return this._total}
    public get discount(): number {return this._discount}
    public get tax(): number {return this._tax}
    public get refunded(): number {return this._refunded}
    public get monitor(): string {return this._monitor}
    
    public get campaigns(): Promise<Campaign[]> {
        if (this._attemptedCampaigns) {
            return Promise.resolve(this._campaigns);
        }

        return this._client("GET", paths.CampaignDatasets(this._id))
        .then(jsonOrError)
        .then((resp) => {
            if (!(resp instanceof Object)) {
                return Promise.reject("Campaign dataset list endpoint returned a malformed response");
            }

            const list = parseListResponse<Campaign>(this._client, resp as {[key: string]: unknown}, campaignFromJSON)
            if (typeof list === "string") {
                return Promise.reject(list);
            }

            this._campaigns = list.content;
            this._attemptedCampaigns = true;

            return list.content;
        });
    }
    public get datasets(): Promise<Dataset[]> {
        if (this._attemptedDatasets) {
            return Promise.resolve(this._datasets);
        }

        return this._client("GET", paths.CampaignDatasets(this._id))
        .then(jsonOrError)
        .then((resp) => {
            if (!(resp instanceof Object)) {
                return Promise.reject("Campaign dataset list endpoint returned a malformed response");
            }

            const list = parseListResponse<Dataset>(this._client, resp as {[key: string]: unknown}, datasetFromJSON)
            if (typeof list === "string") {
                return Promise.reject(list);
            }

            this._datasets = list.content;
            this._attemptedDatasets = true;

            return list.content;
        });
    }
}