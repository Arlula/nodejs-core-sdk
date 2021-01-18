import SearchResult from "./search-result";

export default class OrderRequest {
    private _req?: SearchResult;
    private _id: string;
    private _eula: string;
    private _seats: number;
    private _webhooks?: string[];
    private _emails?: string[];

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

    setWebhooks(hooks: string[]) {
        this._webhooks = hooks;
    }

    addWebhook(hook: string) {
        if (!this._webhooks) {
            this._webhooks = [];
        }
        this._webhooks.push(hook);
    }

    setEmails(emails: string[]) {
        this._emails = emails;
    }

    addEmail(email: string) {
        if (!this._emails) {
            this._emails = [];
        }
        this._emails.push(email);
    }

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

    toJSON(): string {
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

        return JSON.stringify(res);
    }
}

interface orderRequest {
    id: string;
    eula: string;
    seats: number;
    webhooks?: string[];
    emails?: string[];
}
