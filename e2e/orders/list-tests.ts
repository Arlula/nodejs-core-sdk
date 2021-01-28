import Arlula from "../../dist/index";

export default function runOrderListTests(client: Arlula): Promise<unknown> {
    return client.orders().list()
    .then((ordList) => {
        if (!ordList.length) {
            console.log("Orders list empty, expecting existing list");
            return Promise.reject("expecting existing list");
        }
        for (let i=0; i<ordList.length; i++) {
            if (!ordList[i].id) {
                console.log("received order in list with no ID")
                return Promise.reject("received order in list with no ID");
            }
        }
        
    })
    .catch((e) => {
        console.error("unexpected error getting order list: ", e);
        return Promise.reject(e);
    });

}