import Arlula from "../../dist/index";
import Order, { OrderStatus } from "../../dist/orders/order";

export default function runOrderGetTests(client: Arlula): void {
    // get from list
    client.orders().list()
    .then((list) => {
        if (!list.length) {
            console.error("order get 1, failed to get list to check against");
            return;
        }
        let sub: Order = list[0];
        for (let i=0; i<list.length; i++) {
            if (list[i].status === OrderStatus.Complete && !list[i].expiration) {
                sub = list[i];
                break;
            }
        }

        if (sub.status !== OrderStatus.Complete || sub.expiration) {
            console.error("order get 1, no suitable orders found to get");
            return;
        }

        sub.loadResources()
        .then((res) => {
            if (!res.length) {
                console.error("order get 1, get order resources returned empty array");
            }
        })
        .catch((e) => {
            console.error("order get 1, error getting order: ", e);
            return;
        });
    })
    .catch((e) => {
        console.error("order get 1, unexpected error getting order lsit: ", e);
    });


    // get direct
    client.orders().get("1e71e2ff-507b-4fde-accc-f31bc6136afc")
    .then((order) => {
        if (!order.id) {
            console.error("order get 2, got empty order");
            return;
        }

        if (!order.resources.length) {
            console.error("order get 2, get order did not return resources");
            return;
        }
    })
    .catch((e) => {
        console.error("order get 2, unexpected error getting order: ", e);
    });

    // get invalid ID
    // changing version to 6 (invalid version) to invalidate ID
    client.orders().get("1e71e2ff-507b-6fde-accc-f31bc6136afc")
    .then((order) => {
        console.error("order get 3, got order from invalid ID: ", order);
        return;
    })
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("order get 3, unexpected error object: ", e);
            return;
        }
        if (!e.startsWith("")) {
            console.error("order get 3, unexpected error: ", e);
            return;
        }
    });
}