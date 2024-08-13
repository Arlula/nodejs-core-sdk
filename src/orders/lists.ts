import { requestBuilder } from "../util/request";

export interface ListResponse<Type> {
    content: Type[];
    page:    number;
    length:  number;
    count:   number;
}

export function parseListResponse<Type>(client: requestBuilder, json: string|{[key: string]: unknown}, fromJSON: (client: requestBuilder, json: string|{[key: string]: unknown})=>Type|string): ListResponse<Type>|string {
    if (typeof json === "string") {
        json = JSON.parse(json);
    }

    if (!(json instanceof Object)) {
        return "JSON does not correspond to an Order object";
    }

    if (typeof json.page != "number") {
        return "list response is missing page number"
    }
    if (typeof json.length != "number") {
        return "list response is missing page length"
    }
    if (typeof json.count != "number") {
        return "list response is missing result count"
    }
    if (!Array.isArray(json.content)) {
        return "list response content is not an array"
    }

    const resp: ListResponse<Type> = {
        content: [],
        page: json.page,
        length: json.length,
        count: json.count,
    };

    for (let i=0; i<json.content.length; i++) {
        const ite = fromJSON(client, json.content[i]);
        if (typeof ite === "string") {
            return ite;
        }
        resp.content.push(ite)
    }

    return resp;
}
