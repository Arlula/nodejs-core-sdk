import SearchResult from "./search-result";

/**
 * @class OrderRequest wraps the details of an order request
 */
export default class OrderRequest {
    private _req?: SearchResult;
    private _id: string;
    private _eula: string;
    private _seats: number;
    private _webhooks?: string[];
    private _emails?: string[];

    /**
     * creates a new order request
     * @param {string|SearchResult} searchID   The search result (scene) to order, or its corresponding ID
     * @param {string}              eula       The EULA for the order to confirm acceptance
     * @param {number}              seats      The number of seats to license the scene for
     * @param {string[]}            [webhooks] Any webhooks to notify of the orders status
     * @param {string[]}            [emails]   Any emails to notify of the orders status
     */
    constructor(searchID: string|SearchResult, eula: string, seats: number, webhooks?: string[], emails?: string[]) {
        if (typeof searchID === "string") {
            this._id = searchID
        } else {
            this._id = searchID.id;
            this._req = searchID;
        }
        
        this._eula = eula;
        this._seats = seats;

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

        if (this._req && this._eula !== this._req.eula) {
            return false;
        }

        if (this._seats < 1) {
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
            seats: this._seats,
            webhooks: this._webhooks,
            emails: this._emails,
        };

        if (stringify) {
            return JSON.stringify(res);
        }
        return res;
    }
}

interface orderRequest {
    id: string;
    eula: string;
    seats: number;
    webhooks?: string[];
    emails?: string[];
}
