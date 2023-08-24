import dotenv from "dotenv";
import Arlula from "../dist";
import { setCustomHost } from "../dist/util/paths";
import { setDefaultTimeout } from "../dist/util/request";
import runArchiveSearchTests from "./archive/search-tests";
import runArchiveOrderTests from "./archive/order-test";
import runArchiveBatchTests from "./archive/batch-test";
import runTaskingSearchTests from "./tasking/search-test";
import runOrderListTests from "./orders/list-tests";
import runOrderGetTests from "./orders/get-tests";
import runOrderResourceTests from "./orders/resource-test";
import runCollectionGetTests from "./collections/coll-get";
import runCollectionCUDTests from "./collections/coll-cud";
import runItemGetTests from "./collections/item-get";
import runItemCUDTests from "./collections/item-cud";

dotenv.config();

if (process.env.host) {
    setCustomHost(process.env.host);
}

if (process.env.timeout) {
    setDefaultTimeout(parseInt(process.env.timeout || "12000"));
}

console.log("starting tests")
const start = new Date()

const client = new Arlula(process.env.api_key || "", process.env.api_secret || "");

const errors: unknown[] = [];
const tests = [
    // run tests
    testEndpoint,
    // =================
    // archive tests
    // =================
    // archive search tests
    runArchiveSearchTests,
    // archive order tests
    runArchiveOrderTests,
    // archive batch order tests
    runArchiveBatchTests,
    // =================
    // tasking tests
    // =================
    // tasking search tests
    runTaskingSearchTests,
    // =================
    // orders tests
    // =================
    // orders list
    runOrderListTests,
    // order get
    runOrderGetTests,
    // resource download
    runOrderResourceTests,
    // =================
    // collections tests
    // =================
    // collections get
    runCollectionGetTests,
    // collections CUD
    runCollectionCUDTests,
    // collection items get
    runItemGetTests,
    // collection items CUD
    runItemCUDTests,
]

async function runTests() {
    for (const test of tests) {
        try {
            await test(client)
        } catch(e) {
            errors.push(e);
        }
        
    }
    if (errors.length) {
            console.log("tests failed [", (((new Date()).getTime() - start.getTime()) / 1000), "s ]");
            console.log(errors);
    } else {
        console.log("tests successful [", (((new Date()).getTime() - start.getTime()) / 1000), "s ]");
    }
}
runTests();


function testEndpoint(client: Arlula) {
    console.log("connection test")
    return client.test()
    .then((res) => {
        if (!res) {
            return Promise.reject("Connection test failed: " + res);
        }
    });
}
