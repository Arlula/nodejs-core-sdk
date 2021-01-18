
export default class Response {
    status: number;
    headers: {[key:string]: string};
    private _body: string;
    constructor(status: number, headers: {[key:string]: string}, body: string) {
        this.status = status;
        this.headers = headers;
        this._body = body;
    }

    ok(): boolean {
        return this.status >= 200 && this.status < 300;
    }

    text(): string {
        return this._body;
    }

    json(): any {
        return JSON.parse(this._body);
    }
}