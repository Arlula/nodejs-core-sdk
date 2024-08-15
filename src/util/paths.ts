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

    static OrderList(): string {
        return host + "/api/orders";
    }
    static CampaignList(): string {
        return host + "/api/campaigns";
    }
    static DatasetList(): string {
        return host + "/api/datasets";
    }
    static OrderGet(id: string): string {
        return host + `/api/order/${id}`;
    }
    static CampaignGet(id: string): string {
        return host + `/api/campaign/${id}`;
    }
    static DatasetGet(id: string): string {
        return host + `/api/dataset/${id}`;
    }
    static ResourceGet(id: string): string {
        return host + `/api/resource/${id}`;
    }
    static ResourceDownload(id: string): string {
        return host + `/api/resource/${id}/data`;
    }
    static OrderCampaigns(id: string): string {
        return `${host}/api/order/${id}/campaigns`
    }
    static OrderDatasets(id: string): string {
        return `${host}/api/order/${id}/datasets`
    }
    static CampaignDatasets(id: string): string {
        return `${host}/api/campaign/${id}/datasets`
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

    static get TaskingSearch(): string {
        return host+"/api/tasking/search"
    }
    static get TaskingOrder(): string {
        return host + "/api/tasking/order";
    }
    static get TaskingOrderBatch(): string {
        return host + "/api/tasking/order/batch";
    }
}
