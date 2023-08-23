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
    }
    static get ArchiveOrderBatch(): string {
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

    static get CollectionConformance(): string {
        return host + "/api/collections/conformance";
    }
    static get CollectionList(): string {
        return host + "/api/collections";
    }
    static CollectionGet(coll: string): string {
        return host + `/api/collections/${coll}`;
    }
    static get CollectionCreate(): string {
        return host + "/api/collections";
    }
    static CollectionUpdate(coll: string): string {
        return host + `/api/collections/${coll}`;
    }
    static CollectionDelete(coll: string): string {
        return host + `/api/collections/${coll}`;
    }
    static CollectionItemsList(coll: string): string {
        return host + `/api/collections/${coll}/items`;
    }
    static CollectionItemsSearch(coll: string): string {
        return host + `/api/collections/${coll}/search`;
    }
    static CollectionItemGet(coll: string, item: string): string {
        return host + `/api/collections/${coll}/items/${item}`;
    }
    static CollectionItemAdd(coll: string): string {
        return host + `/api/collections/${coll}/items`;
    }
    static CollectionItemRemove(coll: string, item: string): string {
        return host + `/api/collections/${coll}/items/${item}`;
    }
}
