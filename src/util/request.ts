import fetch, { RequestInit, Response } from "node-fetch";

let defaultTimeout = 12_000;

/**
 * override the default timeout for requests by the SDK, for use with slow proxies to prevent unintended timeout
 * 
 * @param {number} timeout number of milliseconds for timeout (defaults to 12000, 12 seconds)
 */
export function setDefaultTimeout(timeout: number): void {
    defaultTimeout = timeout || defaultTimeout;
}

export function authProvider(user: string, pass:string): requestBuilder {
    return function (method: string, path: string, body: unknown, timeout?: number, external?: boolean): Promise<Response> {
        const controller = new AbortController();
        const timeoutCtrl = setTimeout(() => {
            controller.abort();
        }, timeout ? (timeout * (defaultTimeout/12_000)) : defaultTimeout);
        const options: RequestInit = {
            method: method,
            headers: {
                "Authorization": "Basic " + Buffer.from(user + ":" + pass).toString("base64"),
                "X-User-Agent": `arlula-js 3.0.0, API-ver 2022-08, server nodejs ${process.version}; ${process.arch} ${process.platform}`,
                "Content-Type": typeof body != "string" ? "application/json" : "text/plain",
            },
            body: body ? (typeof body != "string" ? JSON.stringify(body) : body) : undefined,
            signal: controller.signal,
            redirect: "manual",
        }
        if (external) {
            // delete internal extras
            delete options.headers;
            delete options.signal;
            delete options.redirect;
        }
        return fetch(path, options)
        .finally(() => {
            clearTimeout(timeoutCtrl);
        });
    }
}

export type requestBuilder = (method: string, path: string, body?: unknown, timeout?: number, external?: boolean) => Promise<Response>

export function voidOrError(r: Response): Promise<void> {
    return new Promise((resolve, reject) => {
        if (r.ok) {
            resolve();
            return;
        }
        r.text()
        .then((resp: string) => {
            reject(resp);
        });
    })
}

export function jsonOrError(r: Response): Promise<unknown> {
    return new Promise((resolve, reject) => {
        if (r.ok) {
            resolve(r.json());
            return;
        }
        r.text()
        .then((resp: string) => {
            reject(resp);
        });
    })
}

export function textOrError(r: Response): Promise<string> {
    return new Promise((resolve, reject) => {
        if (r.ok) {
            resolve(r.text());
            return;
        }
        r.text()
        .then((resp: string) => {
            reject(resp);
        });
    })
}

export function bufferOrError(r: Response): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        if (r.ok) {
            resolve(r.arrayBuffer());
            return;
        }
        r.text()
        .then((resp: string) => {
            reject(resp);
        });
    })
}
