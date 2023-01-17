import Arlula from "../../dist";
import OrderRequest from "../../dist/archive/order-request";
import SearchRequest from "../../dist/archive/search-request";
import SearchResult from "../../dist/archive/search/result";
import Order, { OrderStatus } from "../../dist/orders/order";

export default function runOrderTests(client: Arlula): Promise<unknown> {

    return Promise.all([
        test1(client),
        test2(client),
        testError1(client),
        testError2(client),
        testError3(client),
    ]);

}

// basic order
function test1(client: Arlula) {
    console.log("order 1");
    const req = new OrderRequest(process.env.order_key || "", process.env.order_eula || "", process.env.order_bundle || "default");
    return client.archive().order(req)
    .then((resp) => {
        if (!resp.id) {
            console.error("order 1 - Receives order without ID");
            return Promise.reject("order 1 - Receives order without ID");
        }
        // pre defined landsat order, will be complete and have resource results
        if (resp.status !== OrderStatus.Complete) {
            console.error("order 1 - order not complete");
            return Promise.reject("order 1 - order not complete");
        }
        if (!resp.resources) {
            console.error("order 1 - Landsat order with no resources");
            return Promise.reject("order 1 - Landsat order with no resources");
        }
    })
    .catch(exceptionHandler("order 1 - basic free"));

}

function test2(client: Arlula) {
    console.log("order 2");
    return client.archive().search(new SearchRequest(new Date(2018, 4, 3)).point(151.2108, -33.8523).setMaximumGSD(50))
    .then((resp) => {
        if (!resp.results) {
            console.error("order 2 - no results for test search");
            return Promise.reject("order 2 - no results for test search");
        }
        let scene: SearchResult|null = null;
        sceneLoop:
        for (let i=0; i<resp.results.length; i++) {
            for (let j=0; j<resp.results[i].license.length; j++) {
                if (resp.results[i].bundles[j].price == 0 && resp.results[i].license[j].href == (process.env.order_eula || "")) {
                    scene = resp.results[i];
                    break sceneLoop;
                }
            }
        }
        if (!scene) {
            console.error("order 2 - no valid orders found");
            return Promise.reject("order 2 - no valid orders found");
        }
        const req = new OrderRequest(process.env.order_key || "", process.env.order_eula || "", process.env.order_bundle || "default");
        return client.archive().order(req)
    })
    .then((resp) => {
        if (!resp.id) {
            console.error("order 2 - Receives order without ID");
            return Promise.reject("order 2 - Receives order without ID");
        }
        // pre defined landsat order, will be complete and have resource results
        if (resp.status !== OrderStatus.Complete) {
            console.error("order 2 - order not complete");
            return Promise.reject("order 2 - order not complete");
        }
        if (!resp.resources) {
            console.error("order 2 - Landsat order with no resources");
            return Promise.reject("order 2 - Landsat order with no resources");
        }
    })
    .catch(exceptionHandler("order 2 - chained free"));
    
    

}

function testError1(client: Arlula) {
    console.log("order error 1");
    const req = new OrderRequest("<invalid>", process.env.order_eula || "", process.env.order_bundle || "default");
    return client.archive().order(req)
    .then(expectedError("order error 1 - invalid ordering id"))
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("order error 1 - unexpected error: ", e);
            return Promise.reject("order error 1 - "+e);
        }
        if (!e.startsWith("Invalid ordering ID")) {
            console.error("order error 1 - Unexpected error response: ", e)
            return Promise.reject("order error 1 - "+e);
        }
    });
}

function testError2(client: Arlula) {
    console.log("order error 2");
    const req = new OrderRequest(process.env.order_key || "", "<invalid>", process.env.order_bundle || "default");
    return client.archive().order(req)
    .then(expectedError("order error 2 - invalid eula"))
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("order error 2 - unexpected error: ", e);
            return Promise.reject("order error 2 - "+e);
        }
        if (!e.startsWith("You must confirm acceptance of the EULA")) {
            console.error("order error 2 - Unexpected error response: ", e)
            return Promise.reject("order error 2 - "+e);
        }
    });
}

function testError3(client: Arlula) {
    console.log("order error 3");
    const req = new OrderRequest(process.env.order_key || "", process.env.order_eula || "", "<invalid>");
    return client.archive().order(req)
    .then(expectedError("order error 3 - invalid bundle"))
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("order error 3 - unexpected error: ", e);
            return Promise.reject("order error 3 - "+e);
        }
        if (!e.startsWith("Selected bundle is not an available option of this order")) {
            console.error("order error 3 - Unexpected error response: ", e)
            return Promise.reject("order error 3 - "+e);
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
