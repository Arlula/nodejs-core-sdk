import Arlula from "../../dist";

const tests = [
    test1Conformance,
    test2List,
    test3Get,
    error4GetNotFound,
];

export default function runCollectionGetTests(client: Arlula): Promise<unknown> {

    return tests.reduce((p, test) => {
        return p.then(() => test(client));
     }, Promise.resolve()); // initial

}

function test1Conformance(client: Arlula) {
    console.log("coll-get 1 - conformance");
    return client.collections().conformance()
    .then((resp) => {
        if (!resp) {
            console.log("collection get 1 - conformance: empty response");
            return Promise.reject("collection get 1 - conformance: empty response");
        }
        if (!resp.conformsTo.length) {
            console.log("collection get 1 - conformance: expected conformance list, found empty");
            return Promise.reject("collection get 1 - conformance: expected conformance list, found empty");
        }
    })
    .catch(exceptionHandler("collection get 1 - conformance"));
}

function test2List(client: Arlula) {
    console.log("coll-get 2 - list");
    return client.collections().list()
    .then((resp) => {
        if (!resp.collections.length) {
            console.log("coll-get 2  - list empty, expecting existing list");
            return Promise.reject("coll-get 2  - list empty, expecting existing list");
        }
        for (let i=0; i<resp.collections.length; i++) {
            if (!resp.collections[i].id) {
                console.log("coll-get 2  - received collection in list with no ID")
                return Promise.reject("coll-get 2  - received collection in list with no ID");
            }
        }
    })
    .catch(exceptionHandler("collection get 2 - list"));
}

function test3Get(client: Arlula) {
    console.log("coll-get 3 - get");
    return client.collections().get(process.env.collection_id || "")
    .then((resp) => {
        if (!resp.id) {
            console.log("coll-get 3  - get: collection response with no ID")
                return Promise.reject("coll-get 3  - get: collection response with no ID");
        }
    })
    .catch(exceptionHandler("collection get 3 - get"));
}

function error4GetNotFound(client: Arlula) {
    console.log("coll-get error 1 - not found error");
    return client.collections().get("")
    .then((r) => {
        console.dir(r);
        return Promise.reject("collection get error 1 - not found error: got results from invalid ID");
    })
    .catch((e) => {
        if (!e || !e.startsWith("404 page not found")) {
            console.error("collection get error 1 - not found error: Unexpected error response (search error 1): ", e)
            return Promise.reject("collection get error 1 - not found error: "+e);
        }
    });
}

function exceptionHandler(label: string) {
    return function (e: string) {
        console.error("Error executing " + label + ": ", JSON.stringify(e));
        return Promise.reject(label+": "+JSON.stringify(e));
    }
}
