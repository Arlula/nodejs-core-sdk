import SearchResult from "./search-result";
/**
 * @class OrderRequest wraps the details of an order request
 */
export default class OrderRequest {
    private _req?;
    private _id;
    private _eula;
    private _seats;
    private _webhooks?;
    private _emails?;
    /**
     * creates a new order request
     * @param {string|SearchResult} searchID   The search result (scene) to order, or its corresponding ID
     * @param {string}              eula       The EULA for the order to confirm acceptance
     * @param {number}              seats      The number of seats to license the scene for
     * @param {string[]}            [webhooks] Any webhooks to notify of the orders status
     * @param {string[]}            [emails]   Any emails to notify of the orders status
     */
    constructor(searchID: string | SearchResult, eula: string, seats: number, webhooks?: string[], emails?: string[]);
    /**
     * sets the list of webhooks the order will notify
     * @param {string[]} hooks The list of webhooks
     */
    setWebhooks(hooks: string[]): void;
    /**
     * Add a webhook to the list to notify for the order
     * @param {string} hook the webhook to notify
     */
    addWebhook(hook: string): void;
    /**
     * sets the list of emails the order will notify
     * @param {string[]} emails The list of emails
     */
    setEmails(emails: string[]): void;
    /**
     * Add a email to the list to notify for the order
     * @param {string} email the email to notify
     */
    addEmail(email: string): void;
    /**
     * Checks if the order request is valid or requires additional details/details don't match
     * @returns {boolean} whether the order request is valid
     */
    valid(): boolean;
    /**
     * Converts the request to its JSON ready form
     *
     * Note: this is for internal use and is not intended for use by end users
     *
     * @param {boolean} stringify determines whether the JSON should be marshalled to a string, or returned as an object
     */
    _toJSON(stringify: boolean): string | orderRequest;
}
interface orderRequest {
    id: string;
    eula: string;
    seats: number;
    webhooks?: string[];
    emails?: string[];
}
export {};
