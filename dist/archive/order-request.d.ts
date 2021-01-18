import SearchResult from "./search-result";
export default class OrderRequest {
    private _req?;
    private _id;
    private _eula;
    private _seats;
    private _webhooks?;
    private _emails?;
    constructor(searchID: string | SearchResult, eula: string, seats: number, webhooks?: string[], emails?: string[]);
    setWebhooks(hooks: string[]): void;
    addWebhook(hook: string): void;
    setEmails(emails: string[]): void;
    addEmail(email: string): void;
    valid(): boolean;
    toJSON(): string;
}
