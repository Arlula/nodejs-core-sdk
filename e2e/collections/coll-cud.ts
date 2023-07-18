import Arlula from "../../dist";

const tests = [
    test1Create,
    test2Update,
    test3Delete,
    error1Create,
    error2Update,
    error3Delete,
];

export default function runCollectionCUDTests(client: Arlula): Promise<unknown> {

    return tests.reduce((p, test) => {
        return p.then(() => test(client));
     }, Promise.resolve()); // initial

}

function test1Create(client: Arlula) {
    console.log("coll-cud 1 - create");
    return client.collections().conformance()
    .then((resp) => {
        // TODO
    })
    .catch(exceptionHandler("collection cud 1 - create"));
}

function test2Update(client: Arlula) {
    console.log("coll-cud 2 - update");
    return client.collections().list()
    .then((resp) => {
        // TODO
    })
    .catch(exceptionHandler("collection cud 2 - update"));
}

function test3Delete(client: Arlula) {
    console.log("coll-cud 3 - delete");
    return client.collections().get("")
    .then((resp) => {
        // TODO
    })
    .catch(exceptionHandler("collection cud 3 - delete"));
}

function error1Create(client: Arlula) {
    console.log("coll-get error 1 - not found error");
    return client.collections().get("")
    .then((resp) => {
        // TODO
    })
    .catch(exceptionHandler("collection get error 1 - create"));
}

function error2Update(client: Arlula) {
    console.log("coll-cud error 2 - update");
    return client.collections().get("")
    .then((resp) => {
        // TODO
    })
    .catch(exceptionHandler("collection cud error 2 - update"));
}

function error3Delete(client: Arlula) {
    console.log("coll-cud error 3 - delete");
    return client.collections().get("")
    .then((resp) => {
        // TODO
    })
    .catch(exceptionHandler("collection cud error 3 - delete"));
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
