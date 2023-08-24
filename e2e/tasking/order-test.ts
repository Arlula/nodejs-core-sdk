import Arlula from "../../dist";
import OrderRequest from "../../dist/orders/order-request";
import Order, { OrderStatus } from "../../dist/orders/order";

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
    const req = new OrderRequest(process.env.tasking_order_key || "", process.env.tasking_order_eula || "", process.env.tasking_order_bundle || "default");
    return client.tasking().order(req)
    .then((resp) => {
        if (!resp.id) {
            console.error("tasking order 1 - Receives order without ID");
            return Promise.reject("tasking order 1 - Receives order without ID");
        }
        // pre defined landsat order, will be complete and have resource results
        if (resp.status !== OrderStatus.Complete) {
            console.error("tasking order 1 - order not complete");
            return Promise.reject("tasking order 1 - order not complete");
        }
        if (!resp.resources) {
            console.error("tasking order 1 - Landsat order with no resources");
            return Promise.reject("tasking order 1 - Landsat order with no resources");
        }
    })
    .catch(exceptionHandler("tasking order 1 - basic free"));

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
