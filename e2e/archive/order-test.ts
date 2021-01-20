import { AxiosError } from "axios";
import Arlula from "../../src";
import OrderRequest from "../../src/archive/order-request";
import { OrderStatus } from "../../src/orders/order";

const orderID = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJMQzA4X0wxVFBfMDg5MDg0XzIwMTgwMTE5XzIwMTgwMTIwXzAxX1JUIiwiaWF0IjoxNjExMDM4NTYzLCJpc3MiOiJBcmx1bGEgQXJjaGl2ZSIsInR5cGUiOiJhcmNoaXZlIiwic3VwcGxpZXIiOiJsYW5kc2F0IiwiZXVsYSI6Imh0dHBzOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjAvbGVnYWxjb2RlIiwicHJpY2UiOnsiYmFzZSI6MCwic2VhdHMiOm51bGx9LCJwb2x5Z29uIjpbWzE1MS4yMTA3LC0zMy44NTIxOTk5OTk5OTk5OTZdLFsxNTEuMjEwNywtMzMuODUyNF0sWzE1MS4yMTA5LC0zMy44NTI0XSxbMTUxLjIxMDksLTMzLjg1MjE5OTk5OTk5OTk5Nl1dfQ.uY14s09Mr9xRMnQdnHEURCqmuL5oP9Xaa3eswIu7Mh4";
const eula = "https://creativecommons.org/licenses/by/3.0/legalcode";

export default function runOrderTests(client: Arlula): void {

    // basic order
    const req = new OrderRequest(orderID, eula, 1);
    client.archive().order(req)
    .then((resp) => {
        if (!resp.id) {
            console.error("order 1 - Receives order without ID");
        }
        // pre defined landsat order, will be complete and have resource results
        if (resp.status !== OrderStatus.Complete) {
            console.error("order 1 - order not complete");
        }
        if (!resp.resources) {
            console.error("order 1 - Landsat order with no resources");
        }
    })
    .catch(exceptionHandler("order 1 - basic free"));

    // TODO: add more tests here
    //  - order from search result
    //  - order mismatch eula
    //  - what else?
}


function exceptionHandler(label: string) {
    return function (e: string|AxiosError) {
        console.error("Error executing " + label + ": ", e);
    }
}