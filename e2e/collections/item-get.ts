import Arlula from "../../dist";

const tests = [
    test1ItemList,
    test2ItemListPage,
    test3ItemSearch,
    test4ItemGet,
];

export default function runCollectionGetTests(client: Arlula): Promise<unknown> {

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
        
    })
    .catch(exceptionHandler("collection item get 1 - list"));
}

function test2ItemListPage(client: Arlula) {
    console.log("item-get 1 - list");
    return client.collections().itemsList(process.env.collection_id || "", 1, 2)
    .then((resp) => {
        if (!resp) {
            console.log("collection item get 1 - list page: empty response");
            return Promise.reject("collection item get 1 - list page: empty response");
        }
        
    })
    .catch(exceptionHandler("collection item get 2 - list page"));
}

function test3ItemSearch(client: Arlula) {
    console.log("item-get 1 - list");
    return client.collections().itemsSearch(process.env.collection_id || "", {ids: [process.env.item_id1 || "", process.env.item_id2 || ""]})
    .then((resp) => {
        if (!resp) {
            console.log("collection item get 3 - search: empty response");
            return Promise.reject("collection item get 3 - search: empty response");
        }
        
    })
    .catch(exceptionHandler("collection item get 3 - search"));
}

function test4ItemGet(client: Arlula) {
    console.log("item-get 1 - list");
    return client.collections().itemGet(process.env.collection_id || "",process.env.item_id1 || "")
    .then((resp) => {
        if (!resp) {
            console.log("collection item get 4 - get: empty response");
            return Promise.reject("collection item get 4 - get: empty response");
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
