import OrderRequest, { orderRequest } from "./order-request";

export default class BatchOrderRequest {
    private _orders:   OrderRequest[] = [];
    private _webhooks: string[] = [];
    private _emails:   string[] = [];
    private _team?:    string;
    private _coupon?:  string;
    private _payment?: string;

    /**
     * sets the list of order requests to be submitted
     * @param {OrderRequest[]} orders the list of order requests
     */
    setOrders(orders: OrderRequest[]): void {
        this._orders = orders;
    }

    /**
     * Add an order request to the list to be placed as a batch
     * @param {OrderRequest} order the order to be added
     */
    addOrder(order: OrderRequest): void {
        this._orders.push(order);
    }

    /**
     * sets the list of webhooks the order will notify
     * @param {string[]} hooks The list of webhooks
     */
    setWebhooks(hooks: string[]): void {
        this._webhooks = hooks;
    }

    /**
     * Add a webhook to the list to notify for the order
     * @param {string} hook the webhook to notify
     */
    addWebhook(hook: string): void {
        if (!this._webhooks) {
            this._webhooks = [];
        }
        this._webhooks.push(hook);
    }

    /**
     * sets the list of emails the order will notify
     * @param {string[]} emails The list of emails
     */
    setEmails(emails: string[]): void {
        this._emails = emails;
    }

    /**
     * Add a email to the list to notify for the order
     * @param {string} email the email to notify
     */
    addEmail(email: string): void {
        if (!this._emails) {
            this._emails = [];
        }
        this._emails.push(email);
    }

    /**
     * Set the team the orders will be made available to, if unset, will use the accounts default team
     * @param {string} teamID the uuid of the team to share data with
     */
    setTeamSharing(teamID?: string): void {
        this._team = teamID;
    }

    /**
     * Set the coupon code which may discount the set of orders
     * @param {string} coupon the coupon key to apply to the orders
     */
    setCouponCode(coupon?: string): void {
        this._coupon = coupon;
    }

    /**
     * Set the payment account these orders will be billed to (if applicable).
     * This will supercede any billing accounts set on individual orders.
     * If unset, will use the accounts default billing account.
     * @param {string} accountID the uuid of the billing account to charge
     */
    setPaymentAccount(accountID?: string): void {
        this._payment = accountID;
    }

    valid(): boolean {
        if (this._orders.length < 1) {
            return false;
        }

        const valid = this._orders.map((o) => {return o.valid()}).reduce((p, c, a, i) => {return p&&c}, true);
        if (!valid) {
            return valid;
        }

        return true;
    }
    _toJSON(stringify: boolean): string|batchOrderRequest {
        if (!this.valid()) {
            return "";
        }
        const res: batchOrderRequest = {
            orders: this._orders.map((o)=>{return o._toJSON(false) as orderRequest}),
            webhooks: this._webhooks,
            emails: this._emails,
            team: this._team,
            coupon: this._coupon,
            payment: this._payment,
        };

        if (stringify) {
            return JSON.stringify(res);
        }
        return res;
    }
}

export interface batchOrderRequest {
    orders:   orderRequest[];
    webhooks: string[];
    emails:   string[];
    team?:    string;
    coupon?:  string;
    payment?: string;
}
