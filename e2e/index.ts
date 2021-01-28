import { Key, Secret } from "./credentials";
import Arlula from "../dist";
import runSearchTests from "./archive/search-tests";
import runOrderTests from "./archive/order-test";
import runOrderListTests from "./orders/list-tests";
import runOrderGetTests from "./orders/get-tests";
import runOrderResourceTests from "./orders/resource-test";

const client = new Arlula(Key, Secret);

// run tests
client.test()
.then((res) => {
    if (!res) {
        console.error("Connection test failed")
    }
});

// archive tests

// archive search tests

runSearchTests(client);

// archive order tests

runOrderTests(client);

// orders tests

// orders list

runOrderListTests(client);

// order get

runOrderGetTests(client);

// resource download

runOrderResourceTests(client);


// TODO: all return promises
// use promise.all to get overall result
// use that to return error state for build automation