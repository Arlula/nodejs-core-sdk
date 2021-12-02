import fetch, { Response } from "node-fetch";

export function authProvider(user: string, pass:string): requestBuilder {
    return function (method: string, path: string, body: unknown, timeout?: number): Promise<Response> {
        const controller = new AbortController();
        // const timeoutCtrl = setTimeout(() => {
        //     controller.abort();
        // }, timeout || 12_000);
        console.log("req: ", method, path);
        return fetch(path, {
            method: method,
            headers: {
                "Authorization": "Basic " + Buffer.from(user + ":" + pass).toString("base64"),
                "X-User-Agent": `arlula-js 1.0.0, API-ver 2020-12, server nodejs ${process.version}; ${process.arch} ${process.platform}`,
                'Content-Type': typeof body != "string" ? 'application/json' : "text/plain",
            },
            body: body ? (typeof body != "string" ? JSON.stringify(body) : body) : undefined,
            signal: controller.signal,
        })
        // .finally(() => {
        //     clearTimeout(timeoutCtrl);
        // });
    }
}

export type requestBuilder = (method: string, path: string, body?: unknown, timeout?: number) => Promise<Response>

export function jsonOrError(r: Response): Promise<unknown> {
    return new Promise((resolve, reject) => {
        if (r.ok) {
            resolve(r.json());
            return;
        }
        r.text()
        .then((resp) => {
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
        .then((resp) => {
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
        .then((resp) => {
            reject(resp);
        });
    })
}