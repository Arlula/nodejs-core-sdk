import fetch, { Response } from "node-fetch";

export function authProvider(user: string, pass:string): requestBuilder {
    return function (method: string, path: string, body: unknown, timeout?: number): Promise<Response> {
        const controller = new AbortController();
        const timeoutCtrl = setTimeout(() => {
            controller.abort();
        }, timeout || 12_000);
        // TODO: refactor this after testing correctness
        const headers = {
            "Authorization": "Basic " + Buffer.from(user + ":" + pass).toString("base64"),
            "X-User-Agent": `arlula-js 1.0.0, API-ver 2020-12, server nodejs ${process.version}; ${process.arch} ${process.platform}`,
            "Content-Type": typeof body != "string" ? "application/json" : "text/plain",
        };
        return fetch(path, {
            method: method,
            headers: path.includes("//api.arlula.com") ? headers : undefined,
            body: body ? (typeof body != "string" ? JSON.stringify(body) : body) : undefined,
            signal: path.includes("//api.arlula.com") ? controller.signal : undefined,
            redirect: path.includes("//api.arlula.com") ? "manual" : "follow",
        })
        .finally(() => {
            clearTimeout(timeoutCtrl);
        });
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
