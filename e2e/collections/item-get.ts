import Arlula from "../../dist";

const tests = [
    test1ItemList,
    test2ItemListPage,
    test3ItemSearch,
    test4ItemGet,
];

export default function runItemGetTests(client: Arlula): Promise<unknown> {

    return tests.reduce((p, test) => {
        return p.then(() => test(client));
     }, Promise.resolve()); // initial

}

function test1ItemList(client: Arlula) {
    console.log("item-get 1 - list");
    return client.collections().itemsList(process.env.collection_id || "")
    .then((resp) => {
        if (!resp) {
            console.log("collection item get 1 - list: empty response");
            return Promise.reject("collection item get 1 - list: empty response");
        }
        if (!resp.features.length) {
            console.log("collection item get 1 - list: no features returned");
            return Promise.reject("collection item get 1 - list: no features returned");
        }
        if (resp.features.length != resp.numberReturned) {
            console.log("collection item get 1 - list: listed features don't match reported");
            return Promise.reject("collection item get 1 - list: listed features don't match reported");
        }
        for (let i=0; i<resp.numberReturned; i++) {
            if (!resp.features[i].id) {
                console.log("collection item get 1 - list: listed feature with no id");
                return Promise.reject("collection item get 1 - list: listed feature with no id");
            }
        }
    })
    .catch(exceptionHandler("collection item get 1 - list"));
}

function test2ItemListPage(client: Arlula) {
    console.log("item-get 2 - list");
    return client.collections().itemsList(process.env.collection_id || "", 1, 1)
    .then((resp) => {
        if (!resp) {
            console.log("collection item get 2 - list page: empty response");
            return Promise.reject("collection item get 2 - list page: empty response");
        }
        if (!resp.features.length) {
            console.log("collection item get 2 - list page: no features returned ", resp.features.length);
            return Promise.reject("collection item get 2 - list page: no features returned");
        }
        if (resp.features.length != resp.numberReturned) {
            console.log("collection item get 2 - list page: listed features don't match reported");
            return Promise.reject("collection item get 2 - list page: listed features don't match reported");
        }
        if (resp.features.length != 1) {
            console.log("collection item get 2 - list page: listed features don't match reported "+resp.features.length);
            return Promise.reject("collection item get 2 - list page: listed features don't match reported "+resp.features.length);
        }
        for (let i=0; i<resp.numberReturned; i++) {
            if (!resp.features[i].id) {
                console.log("collection item get 2 - list page: listed feature with no id");
                return Promise.reject("collection item get 2 - list page: listed feature with no id");
            }
        }
    })
    .catch(exceptionHandler("collection item get 2 - list page"));
}

function test3ItemSearch(client: Arlula) {
    console.log("item-get 3 - search");
    return client.collections().itemsSearch(process.env.collection_id || "", {ids: [process.env.item_id1 || "", process.env.item_id2 || ""]})
    .then((resp) => {
        if (!resp) {
            console.log("collection item get 3 - search: empty response");
            return Promise.reject("collection item get 3 - search: empty response");
        }
        if (!resp.features.length) {
            console.log("collection item get 3 - search: no features returned");
            return Promise.reject("collection item get 3 - search: no features returned");
        }
        if (resp.features.length != resp.numberReturned) {
            console.log("collection item get 3 - search: listed features don't match reported");
            return Promise.reject("collection item get 3 - search: listed features don't match reported");
        }
        if (resp.features.length != 2) {
            console.log("collection item get 3 - search: listed features don't match reported "+resp.features.length);
            return Promise.reject("collection item get 3 - search: listed features don't match reported "+resp.features.length);
        }
        for (let i=0; i<resp.numberReturned; i++) {
            if (!resp.features[i].id) {
                console.log("collection item get 3 - search: listed feature with no id");
                return Promise.reject("collection item get 3 - search: listed feature with no id");
            }
            if (resp.features[i].id != process.env.item_id1 && resp.features[i].id != process.env.item_id2) {
                console.log("collection item get 3 - search: listed feature with unexpected id");
                return Promise.reject("collection item get 3 - search: listed feature with unexpected id");
            }
        }
    })
    .catch(exceptionHandler("collection item get 3 - search"));
}

function test4ItemGet(client: Arlula) {
    console.log("item-get 4 - get");
    return client.collections().itemGet(process.env.collection_id || "", process.env.item_id1 || "")
    .then((resp) => {
        if (!resp) {
            console.log("collection item get 4 - get: empty response");
            return Promise.reject("collection item get 4 - get: empty response");
        }
        if (!resp.id) {
            console.log("collection item get 4 - get: no id");
            return Promise.reject("collection item get 4 - get: no id");
        }
        if (resp.id != process.env.item_id1) {
            console.log("collection item get 4 - get: unexpected id");
            return Promise.reject("collection item get 4 - get: unexpected id");
        }
    })
    .catch(exceptionHandler("collection item get 4 - get"));
}

function exceptionHandler(label: string) {
    return function (e: string) {
        console.error("Error executing " + label + ": ", JSON.stringify(e));
        return Promise.reject(label+": "+JSON.stringify(e));
    }
}
