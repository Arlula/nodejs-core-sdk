import Arlula from "../../dist";
import OrderRequest from "../../dist/orders/order-request";
import BatchOrderRequest from "../../dist/orders/batch-order";
import Order, { OrderStatus } from "../../dist/orders/order";

const tests = [
    test1,
];

export default function runBatchTests(client: Arlula): Promise<unknown> {

    return tests.reduce((p, test) => {
        return p.then(() => test(client));
     }, Promise.resolve()); // initial

}

// basic order
function test1(client: Arlula) {
    console.log("tasking batch 1");
    const req = new BatchOrderRequest();
    req.addOrder(new OrderRequest(process.env.tasking_order_key || "", process.env.tasking_order_eula || "", process.env.tasking_order_bundle || "default"));
    req.addOrder(new OrderRequest(process.env.tasking_order_key2 || "", process.env.tasking_order_eula || "", process.env.tasking_order_bundle || "default"));
    return client.tasking().batchOrder(req)
    .then((resp) => {
        if (resp.length != 2) {
            console.error("tasking batch 1 - Response to batch order does not match request length");
            return Promise.reject("tasking batch 1 - Response to batch order does not match request length");
        }
        for (let i=0; i<resp.length; i++) {
            if (!resp[i].id) {
                console.error("tasking batch 1 - Receives batch order without ID");
                return Promise.reject("tasking batch 1 - Receives batch order without ID");
            }
            // pre defined order, will be pending approval and not have resource results
            if (resp[i].status !== OrderStatus.PendingApproval) {
                console.error("tasking batch 1 - batch order not pending approval: ", resp[i].status);
                return Promise.reject("tasking batch 1 - batch order not pending approval");
            }
            if (resp[i].resources.length) {
                console.error("tasking batch 1 - test tasking batch order with resources");
                return Promise.reject("tasking batch 1 - test tasking batch order with resources");
            }
        }
    })
    .catch(exceptionHandler("tasking batch 1"));

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
