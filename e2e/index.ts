import dotenv from "dotenv";
import Arlula from "../dist";
import { setCustomHost } from "../dist/util/paths";
import { setDefaultTimeout } from "../dist/util/request";
import runSearchTests from "./archive/search-tests";
import runOrderTests from "./archive/order-test";
import runOrderListTests from "./orders/list-tests";
import runOrderGetTests from "./orders/get-tests";
import runOrderResourceTests from "./orders/resource-test";

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
    console.log("tests successful [", (((new Date()).getTime() - start.getTime()) / 1000), "s ]");
})
.catch((errors) => {
    console.log("tests failed [", (((new Date()).getTime() - start.getTime()) / 1000), "s ]");
    console.log(errors);
    process.exit(1);
});

function testEndpoint(client: Arlula) {
    return client.test()
    .then((res) => {
        if (!res) {
            return Promise.reject("Connection test failed: " + res);
        }
    });
}
