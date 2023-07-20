import Arlula from "../../dist";

const tests = [
    test1Create,
    test2Update,
    error1Create,
    error2Update,
    error3Delete,
    test3Delete,
];

export default function runCollectionCUDTests(client: Arlula): Promise<unknown> {

    return tests.reduce((p, test) => {
        return p.then(() => test(client));
     }, Promise.resolve()); // initial

}

let savedID = "";

function test1Create(client: Arlula) {
    console.log("coll-cud 1 - create");
    return client.collections().create("node SDK test", "testing the node sdk create behavior", [])
    .then((resp) => {
        savedID = resp.id;  
        if (!resp.id) {
            return Promise.reject("collection cud 1 - returned collection has invalid ID");
        }
        if (resp.title != "node SDK test") {
            return Promise.reject("collection cud 1 - returned collection has incorrect title");
        }
    })
    .catch(exceptionHandler("collection cud 1 - create"));
}

function test2Update(client: Arlula) {
    console.log("coll-cud 2 - update");
    if (!savedID) {
        return Promise.reject("collection cud 2 - no saved ID to update");
    }
    return client.collections().update(savedID, "node updated title", "", ["node", "test"])
    .then((resp) => {
        if (resp.id != savedID) {
            return Promise.reject("collection cud 2 - error returned id does not match the expected value");
        }
        if (resp.title != "node updated title") {
            return Promise.reject("collection cud 2 - error returned title does not match the expected value");
        }
        if (resp.keywords.length != 2) {
            return Promise.reject("collection cud 2 - error returned keywords are not of the expected length");
        }
        if (resp.keywords[0] != "node" || resp.keywords[1] != "test") {
            return Promise.reject("collection cud 2 - error returned keywords does not match the expected value");
        }
    })
    .catch(exceptionHandler("collection cud 2 - update"));
}

function test3Delete(client: Arlula) {
    console.log("coll-cud 3 - delete");
    if (!savedID) {
        return Promise.reject("collection cud 2 - no saved ID to delete");
    }
    return client.collections().delete(savedID)
    .catch(exceptionHandler("collection cud 3 - delete"));
}

function error1Create(client: Arlula) {
    console.log("coll-get error 1 - not found error");
    return client.collections().create("!!!!!!`;", "", [])
    .then(expectedError("collection cud error 2 - update"))
    .catch((e) => {
        if (!e || !e.startsWith("Invalid collection title")) {
            console.error("collection cud error 1 - create: Unexpected error response: ", e)
            return Promise.reject("collection cud error 1 - create unexpected error: "+e);
        }
    });
}

function error2Update(client: Arlula) {
    console.log("coll-cud error 2 - update");
    return client.collections().update(savedID, "!!!!!!`;", "", [])
    .then(expectedError("collection cud error 2 - update"))
    .catch((e) => {
        if (!e || !e.startsWith("Invalid collection title")) {
            console.error("collection cud error 2 - update: Unexpected error response: ", e)
            return Promise.reject("collection cud error 2 - update unexpected error: "+e);
        }
    });
}

function error3Delete(client: Arlula) {
    console.log("coll-cud error 3 - delete");
    return client.collections().delete("")
    .catch((e) => {
        if (!e || !e.startsWith("404 page not found")) {
            console.error("collection cud error 3 - delete not found error: Unexpected error response: ", e)
            return Promise.reject("collection cud error 3 - delete not found error: "+e);
        }
    });
}

function exceptionHandler(label: string) {
    return function (e: string) {
        console.error("Error executing " + label + ": ", JSON.stringify(e));
        return Promise.reject(label+": "+JSON.stringify(e));
    }
}

function expectedError(label: string) {
    return function (result: unknown) {
        console.error("Error executing"+label+": ", result);
        return Promise.reject(label+": "+result);
    }
}
