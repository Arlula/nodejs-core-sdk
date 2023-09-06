import SearchResult from "../archive/search/result";

/**
 * @class OrderRequest wraps the details of an order request
 * 
 * @see {https://arlula.com/documentation/#archive-order|Archive Order endpoint documentation}
 * or
 * @see {https://arlula.com/documentation/#ref-order-request|Archive order request structure reference}
 */
export default class OrderRequest {
    private _req?: SearchResult;
    private _id: string;
    private _eula: string;
    private _bundleKey: string;
    private _webhooks?: string[];
    private _emails?: string[];
    private _team?:    string;
    private _coupon?:  string;
    private _payment?: string;

    /**
     * creates a new order request
     * @param {string|SearchResult} searchID   The search result (scene) to order, or its corresponding ID
     * @param {string}              eula       The EULA for the order to confirm acceptance
     * @param {string}              bundleKey  the bundle of imagery bands and processing to order
     * @param {string[]}            [webhooks] Any webhooks to notify of the orders status
     * @param {string[]}            [emails]   Any emails to notify of the orders status
     */
    constructor(searchID: string|SearchResult, eula: string, bundleKey: string, webhooks?: string[], emails?: string[]) {
        if (typeof searchID === "string") {
            this._id = searchID
        } else {
            this._id = searchID.orderingID;
            this._req = searchID;
        }
        
        this._eula = eula;
        this._bundleKey = bundleKey;

        if (webhooks) {
            this._webhooks = webhooks;
        }
        if (emails) {
            this._emails = emails;
        }
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
     * Set the team the order will be made available to, if unset, will use the accounts default team
     * @param {string} teamID the uuid of the team to share data with
     */
    setTeamSharing(teamID?: string): void {
        this._team = teamID;
    }

    /**
     * Set the coupon code which may discount the order
     * @param {string} coupon the coupon key to apply to the order
     */
    setCouponCode(coupon?: string): void {
        this._coupon = coupon;
    }

    /**
     * Set the payment account this order will be billed to (if applicable).
     * If unset, will use the accounts default billing account.
     * @param {string} accountID the uuid of the billing account to charge
     */
    setPaymentAccount(accountID?: string): void {
        this._payment = accountID;
    }

    /**
     * Checks if the order request is valid or requires additional details/details don't match
     * @returns {boolean} whether the order request is valid
     */
    valid(): boolean {
        
        if (!this._id) {
            return false;
        }

        if (!this._eula) {
            return false;
        }

        let found = false;
        this._req?.licenses.some((v) => {
            if (v.href === this._eula) {
                found = true;
                return found;
            }
        })
        if (this._req && !found) {
            return false;
        }

        if (this._bundleKey == "") {
            return false;
        }

        return true;
    }

    /**
     * Converts the request to its JSON ready form
     * 
     * Note: this is for internal use and is not intended for use by end users
     * 
     * @param {boolean} stringify determines whether the JSON should be marshalled to a string, or returned as an object
     */
    _toJSON(stringify: boolean): string|orderRequest {
        if (!this.valid()) {
            return "";
        }
        const res: orderRequest = {
            id: this._id,
            eula: this._eula,
            bundleKey: this._bundleKey,
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

export interface orderRequest {
    id: string;
    eula: string;
    bundleKey: string;
    webhooks?: string[];
    emails?: string[];
    team?:    string;
    coupon?:  string;
    payment?: string;
}
