import Arlula from "../../dist/index";

export default function runOrderListTests(client: Arlula): Promise<unknown> {
    console.log("order list")
    return client.orders().list()
    .then((ordList) => {
        if (!ordList.length) {
            console.log("Order list - list empty, expecting existing list");
            return Promise.reject("order list - list empty, expecting existing list");
        }
        for (let i=0; i<ordList.length; i++) {
            if (!ordList[i].id) {
                console.log("order list - received order in list with no ID")
                return Promise.reject("order list - received order in list with no ID");
            }
        }
        
    })
    .catch((e) => {
        console.error("order list - unexpected error getting order list: ", e);
        return Promise.reject("order list - "+e);
    });

}