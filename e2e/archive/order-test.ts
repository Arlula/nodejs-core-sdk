import Arlula from "../../dist";
import OrderRequest from "../../dist/archive/order-request";
import Order, { OrderStatus } from "../../dist/orders/order";

export default function runOrderTests(client: Arlula): Promise<unknown> {

    return Promise.all([
        test1(client),
        testError1(client),
        testError2(client),
        // TODO: enable this once 2022-07 is live on all servers
        // testError3(client),
    ]);

}

// basic order
function test1(client: Arlula) {
    console.log("order 1");
    const req = new OrderRequest(process.env.order_key || "", process.env.order_eula || "", "default");
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

// TODO: add more tests here
//  - order from search result

function testError1(client: Arlula) {
    console.log("order error 1");
    const req = new OrderRequest("<invalid>", process.env.order_eula || "", "default");
    return client.archive().order(req)
    .then(expectedError("order error 1 - invalid ordering id"))
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("order error 1 - unexpected error: ", e);
            return Promise.reject("order error 1 - "+e);
        }
        if (!e.startsWith("Invalid Ordering ID")) {
            console.error("order error 1 - Unexpected error response: ", e)
            return Promise.reject("order error 1 - "+e);
        }
    });
}

function testError2(client: Arlula) {
    console.log("order error 2");
    const req = new OrderRequest(process.env.order_key || "", "<invalid>", "default");
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
        if (!e.startsWith("Invalid Latitude")) {
            console.error("order error 3 - Unexpected error response: ", e)
            return Promise.reject("order error 3 - "+e);
        }
    });
}


function exceptionHandler(label: string) {
    return function (e: string) {
        console.error("Error executing " + label + ": ", e);
        return Promise.reject(label+": "+e);
    }
}

function expectedError(label: string) {
    return function (result: Order) {
        console.error("Error executing"+label+": ", result);
        return Promise.reject(label+": "+result);
    }
}
