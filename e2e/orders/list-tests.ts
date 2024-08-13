import Arlula from "../../dist/index";


const tests = [
    orderListTest,
    // test1,
    // test2,
    // test3,
    // test4,
    // test5,
    // test6,
    // test7,
    // test1Sort,
    // testError1,
    // testError2,
    // testError3,
];

export default function runListTests(client: Arlula): Promise<unknown> {

    return tests.reduce((p, test) => {
        return p.then(() => test(client));
     }, Promise.resolve()); // initial

}

function orderListTest(client: Arlula) {
    console.log("order list")
    return client.orders().orderList()
    .then((ordList) => {
        if (!ordList.length) {
            console.log("Order list - list empty, expecting existing list");
            return Promise.reject("order list - list empty, expecting existing list");
        }
        for (let i=0; i<ordList.length; i++) {
            if (!ordList.content[i].id) {
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