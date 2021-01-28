import Arlula from "../../dist/index";

export default function runOrderListTests(client: Arlula): void {
    client.orders().list()
    .then((ordList) => {
        if (!ordList.length) {
            console.log("Orders list empty, expecting existing list");
        }
        ordList.forEach((ord) => {
            if (!ord.id) {
                console.log("received order in list with no ID")
            }
        });
    })
    .catch((e) => {
        console.error("unexpected error getting order list: ", e);
    });

}