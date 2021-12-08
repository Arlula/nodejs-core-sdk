import { Key, Secret, host, timeout } from "./credentials";
import Arlula from "../dist";
import { setCustomHost } from "../dist/util/paths";
import { setDefaultTimeout } from "../dist/util/request";
import runSearchTests from "./archive/search-tests";
import runOrderTests from "./archive/order-test";
import runOrderListTests from "./orders/list-tests";
import runOrderGetTests from "./orders/get-tests";
import runOrderResourceTests from "./orders/resource-test";

if (host || process.env.host) {
    setCustomHost(host);
}

if (timeout || process.env.timeout) {
    setDefaultTimeout(timeout)
}

console.log("starting tests")
const start = new Date()

const client = new Arlula(Key || process.env.api_key, Secret || process.env.api_secret);

Promise.all([
    // run tests
    testEndpoint(client),
    // =============
    // archive tests
    // =============
    // archive search tests
    runSearchTests(client),
    // archive order tests
    runOrderTests(client),
    // ============
    // orders tests
    // ============
    // orders list
    runOrderListTests(client),
    // order get
    runOrderGetTests(client),
    // resource download
    runOrderResourceTests(client),
])
.then(() => {
    console.log("tests successful [", (((new Date()).getTime() - start.getTime()) / 1000), "]");
})
.catch((errors) => {
    console.log("tests failed [", (((new Date()).getTime() - start.getTime()) / 1000), "]");
    console.log(errors)
});

function testEndpoint(client: Arlula) {
    return client.test()
    .then((res) => {
        if (!res) {
            return Promise.reject("Connection test failed: " + res);
        }
    });
}
