import Arlula from "../../dist";
import OrderRequest from "../../dist/tasking/order-request";
import BatchOrderRequest from "../../dist/tasking/batch-order";
import Order from "../../dist/orders/order";
import { StatusCode } from "../../dist/orders/status";

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
    req.addOrder(new OrderRequest(process.env.tasking_order_key || "", process.env.tasking_order_eula || "", process.env.tasking_order_bundle || "default", process.env.tasking_order_priority || "standard", parseInt(process.env.tasking_order_cloud || "70")));
    req.addOrder(new OrderRequest(process.env.tasking_order_key2 || "", process.env.tasking_order_eula || "", process.env.tasking_order_bundle || "default", process.env.tasking_order_priority || "standard", parseInt(process.env.tasking_order_cloud || "70")));
    return client.tasking().batchOrder(req)
    .then(async (resp) => {
        if (resp.status === StatusCode.Complete) {
            console.error("tasking batch 1 - Response to batch order is complete when a tasking order");
            return Promise.reject("tasking batch 1 - Response to batch order is complete when a tasking order");
        }
        
        const campaigns = await resp.campaigns;
    
        if (campaigns.length != 2) {
            console.error("tasking batch 1 - Response to batch order does not match request length");
            return Promise.reject("tasking batch 1 - Response to batch order does not match request length");
        }
        for (let i=0; i<campaigns.length; i++) {
            if (!campaigns[i].id) {
                console.error("tasking batch 1 - Receives batch order without ID");
                return Promise.reject("tasking batch 1 - Receives batch order without ID");
            }
            // pre defined order, will be pending approval and not have resource results
            if (campaigns[i].status !== StatusCode.PendingApproval) {
                console.error("tasking batch 1 - batch order not pending approval: ", campaigns[i].status);
                return Promise.reject("tasking batch 1 - batch order not pending approval");
            }
            if (campaigns[0].start <= (new Date())) {
                console.error("tasking batch order 1 - batch tasking order with start date in the past");
                return Promise.reject("tasking batch order 1 - batch tasking order with start date in the past");
            }
            if (campaigns[0].end <= (new Date())) {
                console.error("tasking batch order 1 - batch tasking order with end date in the past");
                return Promise.reject("tasking batch order 1 - batch tasking order with end date in the past");
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
