import baseRequest, { orderRequest as baseOutput } from "../archive/order-request";

export default class OrderRequest extends baseRequest {
    private _priority: string;
    private _cloud = -1;
    constructor(orderingID: string, eula: string, bundleKey: string, priority: string, cloud: number, webhooks?: string[], emails?: string[]) {
        super(orderingID, eula, bundleKey, webhooks, emails);
        this._priority = priority;
        this._cloud = cloud;
    }

    valid(): boolean {
        if (!super.valid()) {
            return false;
        }

        if (this._priority == "") {
            return false;
        }

        if (this._cloud < 0) {
            return false;
        }

        return true;
    }
    _toJSON(stringify: boolean): string|orderRequest {
        const req = super._toJSON(false) as orderRequest;
        req.priority = this._priority;
        req.cloud = this._cloud;

        if (stringify) {
            return JSON.stringify(req);
        }
        return req;
    }
}

export interface orderRequest extends baseOutput {
    priority: string;
    cloud: number;
}