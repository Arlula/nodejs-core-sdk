import Arlula from "../../dist";
import OrderRequest from "../../dist/archive/order-request";
import BatchOrderRequest from "../../dist/archive/batch-order";
import Order from "../../dist/orders/order";
import { StatusCode } from "../../dist/orders/status";

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
    console.log("archive batch 1");
    const req = new BatchOrderRequest();
    req.addOrder(new OrderRequest(process.env.order_key || "", process.env.order_eula || "", process.env.order_bundle || "default"));
    req.addOrder(new OrderRequest(process.env.order_key2 || "", process.env.order_eula || "", process.env.order_bundle || "default"));
    return client.archive().batchOrder(req)
    .then(async (resp) => {
        const ds = await resp.datasets;
        if (ds.length != 2) {
            console.error("archive batch 1 - Response to batch order does not match request length");
            return Promise.reject("archive batch 1 - Response to batch order does not match request length");
        }
        for (let i=0; i<ds.length; i++) {
            if (!ds[i].id) {
                console.error("archive batch 1 - Receives batch order without ID");
                return Promise.reject("archive batch 1 - Receives batch order without ID");
            }
            // pre defined landsat order, will be complete and have resource results
            if (ds[i].status !== StatusCode.Complete) {
                console.error("archive batch 1 - batch order not complete");
                return Promise.reject("archive batch 1 - batch order not complete");
            }
            if (!ds[i].resources) {
                console.error("archive batch 1 - Landsat batch order with no resources");
                return Promise.reject("archive batch 1 - Landsat batch order with no resources");
            }
        }
    })
    .catch(exceptionHandler("archive batch 1 - basic free"));

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
