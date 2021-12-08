import Arlula from "../../dist";
import OrderRequest from "../../dist/archive/order-request";
import { OrderStatus } from "../../dist/orders/order";

import { orderingID, orderEULA } from "../credentials";

export default function runOrderTests(client: Arlula): Promise<unknown> {

    return Promise.all([
        test1(client)
    ]);

}

// basic order
function test1(client: Arlula) {
    console.log("order 1");
    const req = new OrderRequest(orderingID || process.env.order_key, orderEULA || process.env.order_eula || "", 1);
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
//  - order mismatch eula
//  - what else?


function exceptionHandler(label: string) {
    return function (e: string) {
        console.error("Error executing " + label + ": ", e);
        return Promise.reject(label+": "+e);
    }
}