import Response from "./response";

export let host = "https://api.arlula.com";

export interface clientConstructor {
    new(key: string, secret: string): client;
}

export interface client {
    do(req: request): Promise<Response>;
}

export class request {
    method: RequestMethod = RequestMethod.Get;
    path: string;
    params: {[key:string]:string} = {};
    body?: string;
    mime: string = "application/json";
    constructor(path: string, method?: RequestMethod) {
        this.path = path;
        if (!this.path.startsWith("/")) {
            this.path = "/"+this.path;
        }
        if (method) {
            this.method = method;
        }
    }

    addParam(key:string, value:string): request {
        this.params[key] = value;
        return this;
    }

    addBatchParams(params: {[key: string]: string}): request {
        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                this.params[key] = params[key];
            }
        }
        return this;
    }

    setBody(content: string, mime?: string): request {

        this.body = content;
        if (mime) {
            this.mime = mime;
        }

        return this;
    }

    getURL(): string {
        let url = host + this.path;

        if (Object.keys(this.params).length) {
            url += "?";
            for (let key in this.params) {
                if (this.params.hasOwnProperty(key)) {
                    url += `${key}=${this.params[key]}&`;
                }
            }
            url = url.substring(0, url.length-1);
        }

        return url;
    }
}

export enum RequestMethod {
    Get = "GET",
    Post = "POST",
}
