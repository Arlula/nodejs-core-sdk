import Arlula from "../../dist";
import OrderRequest from "../../dist/archive/order-request";
import SearchRequest from "../../dist/archive/search-request";
import SearchResult from "../../dist/archive/search/result";
import Order from "../../dist/orders/order";
import { StatusCode } from "../../dist/orders/status";

const tests = [
    test1,
    test2,
    testError1,
    testError2,
    testError3,
];

export default function runOrderTests(client: Arlula): Promise<unknown> {

    return tests.reduce((p, test) => {
        return p.then(() => test(client));
     }, Promise.resolve()); // initial

}

// basic order
function test1(client: Arlula) {
    console.log("archive order 1");
    const req = new OrderRequest(process.env.order_key || "", process.env.order_eula || "", process.env.order_bundle || "default");
    return client.archive().order(req)
    .then(async (resp) => {
        if (!resp.id) {
            console.error("archive order 1 - Receives order without ID");
            return Promise.reject("archive order 1 - Receives order without ID");
        }
        // pre defined landsat order, will be complete and have resource results
        if (resp.status !== StatusCode.Complete) {
            console.error("archive order 1 - order not complete");
            return Promise.reject("archive order 1 - order not complete");
        }
        const ds = await resp.datasets;
        if (!ds) {
            console.error("archive order 1 - Landsat order with no datasets");
            return Promise.reject("archive order 1 - Landsat order with no datasets");
        }
        if (!ds[0].resources) {
            console.error("archive order 1 - Landsat order with no resources");
            return Promise.reject("archive order 1 - Landsat order with no resources");
        }
    })
    .catch(exceptionHandler("archive order 1 - basic free"));

}

function test2(client: Arlula) {
    console.log("archive order 2");
    return client.archive().search(new SearchRequest(new Date(2018, 4, 3)).point(151.2108, -33.8523).setMaximumGSD(50))
    .then((resp) => {
        if (!resp.results) {
            console.error("archive order 2 - no results for test search");
            return Promise.reject("archive order 2 - no results for test search");
        }
        let scene: SearchResult|null = null;
        sceneLoop:
        for (let i=0; i<resp.results.length; i++) {
            for (let j=0; j<resp.results[i].licenses.length; j++) {
                if (resp.results[i].bundles[j].price == 0 && resp.results[i].licenses[j].href == (process.env.order_eula || "")) {
                    scene = resp.results[i];
                    break sceneLoop;
                }
            }
        }
        if (!scene) {
            console.error("archive order 2 - no valid orders found");
            return Promise.reject("archive order 2 - no valid orders found");
        }
        const req = new OrderRequest(process.env.order_key || "", process.env.order_eula || "", process.env.order_bundle || "default");
        return client.archive().order(req)
    })
    .then(async (resp) => {
        if (!resp.id) {
            console.error("archive order 2 - Receives order without ID");
            return Promise.reject("archive order 2 - Receives order without ID");
        }
        // pre defined landsat order, will be complete and have resource results
        if (resp.status !== StatusCode.Complete) {
            console.error("archive order 2 - order not complete");
            return Promise.reject("archive order 2 - order not complete");
        }
        const ds = await resp.datasets;
        if (!ds) {
            console.error("archive order 2 - Landsat order with no datasets");
            return Promise.reject("archive order 2 - Landsat order with no datasets");
        }

        if (!ds[0].resources) {
            console.error("archive order 2 - Landsat order with no resources");
            return Promise.reject("archive order 2 - Landsat order with no resources");
        }
    })
    .catch(exceptionHandler("archive order 2 - chained free"));
    
    

}

function testError1(client: Arlula) {
    console.log("archive order error 1");
    const req = new OrderRequest("<invalid>", process.env.order_eula || "", process.env.order_bundle || "default");
    return client.archive().order(req)
    .then(expectedError("archive order error 1 - invalid ordering id"))
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("archive order error 1 - unexpected error: ", e);
            return Promise.reject("archive order error 1 - "+e);
        }
        if (!e.startsWith("Invalid ordering ID")) {
            console.error("archive order error 1 - Unexpected error response: ", e)
            return Promise.reject("archive order error 1 - "+e);
        }
    });
}

function testError2(client: Arlula) {
    console.log("archive order error 2");
    const req = new OrderRequest(process.env.order_key || "", "<invalid>", process.env.order_bundle || "default");
    return client.archive().order(req)
    .then(expectedError("archive order error 2 - invalid eula"))
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("archive order error 2 - unexpected error: ", e);
            return Promise.reject("archive order error 2 - "+e);
        }
        if (!e.startsWith("You must confirm acceptance of the EULA")) {
            console.error("archive order error 2 - Unexpected error response: ", e)
            return Promise.reject("archive order error 2 - "+e);
        }
    });
}

function testError3(client: Arlula) {
    console.log("archive order error 3");
    const req = new OrderRequest(process.env.order_key || "", process.env.order_eula || "", "<invalid>");
    return client.archive().order(req)
    .then(expectedError("archive order error 3 - invalid bundle"))
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("archive order error 3 - unexpected error: ", e);
            return Promise.reject("archive order error 3 - "+e);
        }
        if (!e.startsWith("Selected bundle is not an available option of this order")) {
            console.error("archive order error 3 - Unexpected error response: ", e)
            return Promise.reject("archive order error 3 - "+e);
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
    return function (result: Order) {
        console.error("Error executing"+label+": ", result);
        return Promise.reject(label+": "+result);
    }
}
