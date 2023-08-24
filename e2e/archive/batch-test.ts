import Arlula from "../../dist";
import OrderRequest from "../../dist/orders/order-request";
import BatchOrderRequest from "../../dist/orders/batch-order";
import Order, { OrderStatus } from "../../dist/orders/order";

const tests = [
    test1,
    // test2,
    // testError1,
    // testError2,
    // testError3,
];

export default function runBatchTests(client: Arlula): Promise<unknown> {

    return tests.reduce((p, test) => {
        return p.then(() => test(client));
     }, Promise.resolve()); // initial

}

// basic order
function test1(client: Arlula) {
    console.log("batch 1");
    const req = new BatchOrderRequest();
    req.addOrder(new OrderRequest(process.env.order_key || "", process.env.order_eula || "", process.env.order_bundle || "default"));
    req.addOrder(new OrderRequest(process.env.order_key2 || "", process.env.order_eula || "", process.env.order_bundle || "default"));
    return client.archive().batchOrder(req)
    .then((resp) => {
        if (resp.length != 2) {
            console.error("batch 1 - Response to batch order does not match request length");
            return Promise.reject("batch 1 - Response to batch order does not match request length");
        }
        for (let i=0; i<resp.length; i++) {
            if (!resp[i].id) {
                console.error("batch 1 - Receives batch order without ID");
                return Promise.reject("batch 1 - Receives batch order without ID");
            }
            // pre defined landsat order, will be complete and have resource results
            if (resp[i].status !== OrderStatus.Complete) {
                console.error("batch 1 - batch order not complete");
                return Promise.reject("batch 1 - batch order not complete");
            }
            if (!resp[i].resources) {
                console.error("batch 1 - Landsat batch order with no resources");
                return Promise.reject("batch 1 - Landsat batch order with no resources");
            }
        }
    })
    .catch(exceptionHandler("batch 1 - basic free"));

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
