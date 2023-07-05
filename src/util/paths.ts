let host = "https://api.arlula.com";

export function setCustomHost(base: string): void {
    host = base;
}

export default class paths {
    static get Test(): string {
        return host+"/api/test";
    }
    static get ArchiveSearch(): string {
        return host + "/api/archive/search";
    }
    static get ArchiveOrder(): string {
        return host + "/api/archive/order";
    }static get ArchiveOrderBatch(): string {
        return host + "/api/archive/order/batch";
    }
    static get OrderList(): string {
        return host + "/api/order/list";
    }
    static get OrderGet(): string {
        return host + "/api/order/get";
    }
    static get ResourceDownload(): string {
        return host + "/api/order/resource/get";
    }
}
