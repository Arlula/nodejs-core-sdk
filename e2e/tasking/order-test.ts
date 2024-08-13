import Arlula from "../../dist";
import OrderRequest from "../../dist/tasking/order-request";
import Order from "../../dist/orders/order";
import { StatusCode } from "../../dist/orders/status";

const tests = [
    test1,
];

export default function runOrderTests(client: Arlula): Promise<unknown> {

    return tests.reduce((p, test) => {
        return p.then(() => test(client));
     }, Promise.resolve()); // initial

}

// basic order
function test1(client: Arlula) {
    console.log("tasking order 1");
    const req = new OrderRequest(process.env.tasking_order_key || "", process.env.tasking_order_eula || "", process.env.tasking_order_bundle || "default", process.env.tasking_order_priority || "standard", parseInt(process.env.tasking_order_cloud || "70"));
    return client.tasking().order(req)
    .then(async (resp) => {
        if (!resp.id) {
            console.error("tasking order 1 - Receives order without ID");
            return Promise.reject("tasking order 1 - Receives order without ID");
        }
        // pre defined order, will be pending approval and not have resource results
        if (resp.status !== StatusCode.PendingApproval) {
            console.error("tasking order 1 - order not pending approval: ", resp.status);
            return Promise.reject("tasking order 1 - order not pending approval");
        }

        const cpgn = await resp.campaigns;
        if (!cpgn.length) {
            console.error("tasking order 1 - test tasking order with no campaigns");
            return Promise.reject("tasking order 1 - test tasking order with no campaigns");
        }

        if (cpgn[0].status != StatusCode.PendingApproval) {
            console.error("tasking order 1 - test tasking order returned an incorrect initial status");
            return Promise.reject("tasking order 1 - test tasking order returned an incorrect initial status");
        }
        if (cpgn[0].start <= (new Date())) {
            console.error("tasking order 1 - test tasking order with start date in the past");
            return Promise.reject("tasking order 1 - test tasking order with start date in the past");
        }
        if (cpgn[0].end <= (new Date())) {
            console.error("tasking order 1 - test tasking order with end date in the past");
            return Promise.reject("tasking order 1 - test tasking order with end date in the past");
        }
    })
    .catch(exceptionHandler("tasking order 1"));

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
