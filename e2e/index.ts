import { Key, Secret, host } from "./credentials";
import Arlula from "../dist";
import { setCustomHost } from "../dist/util/paths";
import runSearchTests from "./archive/search-tests";
import runOrderTests from "./archive/order-test";
import runOrderListTests from "./orders/list-tests";
import runOrderGetTests from "./orders/get-tests";
import runOrderResourceTests from "./orders/resource-test";

if (host) {
    setCustomHost(host);
}

const client = new Arlula(Key, Secret);

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
    console.log("tests successful");
})
.catch(() => {
    console.log("tests failed");
    // TODO: return failure status 
});

function testEndpoint(client: Arlula) {
    return client.test()
    .then((res) => {
        if (!res) {
            return Promise.reject("Connection test failed: " + res);
        }
    });
}
