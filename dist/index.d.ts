import Archive from "./archive/index";
import Orders from "./orders/index";
export default class Arlula {
    private _client;
    private _archive;
    private _orders;
    constructor(key: string, secret: string);
    test(): Promise<boolean>;
    archive(): Archive;
    orders(): Orders;
}
