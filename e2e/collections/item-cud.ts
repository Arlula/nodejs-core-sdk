import Arlula from "../../dist";

const tests = [
    test1ItemAdd,
    test2ItemRm,
];

export default function runItemCUDTests(client: Arlula): Promise<unknown> {

    return tests.reduce((p, test) => {
        return p.then(() => test(client));
     }, Promise.resolve()); // initial

}

function test1ItemAdd(client: Arlula) {
    console.log("item-cud 1 - add");
    return client.collections().itemAdd(process.env.collection_id || "", process.env.order_id || "")
    .then(async () => {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                client.collections().itemGet(process.env.collection_id || "", process.env.order_id || "")
                .then((resp) => {
                    if (!resp) {
                        console.log("collection item cud 1 - add: empty response");
                        reject("collection item cud 1 - add: empty response");
                    }
                    if (!resp.id) {
                        console.log("collection item cud 1 - add: no id");
                        reject("collection item cud 1 - add: no id");
                    }
                    if (resp.id != process.env.order_id) {
                        console.log("collection item cud 1 - add: unexpected id");
                        reject("collection item cud 1 - add: unexpected id");
                    }

                    resolve(undefined);
                })
            }, 60*1000);
        })
    })
    .catch(exceptionHandler("collection item cud 1 - add"));
}

function test2ItemRm(client: Arlula) {
    console.log("item-cud 2 - rm");
    return client.collections().itemAdd(process.env.collection_id || "", process.env.order_id || "")
    .then(async () => {
        // TODO: establish the cache duration before uncommenting this
        // await new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         client.collections().itemGet(process.env.collection_id || "", process.env.order_id || "")
        //         .then((resp) => {
        //             if (resp) {
        //                 console.log("collection item cud 2 - rm: response to removed item");
        //                 console.log(JSON.stringify(resp));
        //                 reject("collection item cud 2 - rm: response to removed item");
        //                 return;
        //             }

        //             resolve(undefined);
        //         })
        //     }, 60*1000);
        // });
    })
    .catch(exceptionHandler("collection item cud 2 - rm"));
}

function exceptionHandler(label: string) {
    return function (e: string) {
        console.error("Error executing " + label + ": ", JSON.stringify(e));
        return Promise.reject(label+": "+JSON.stringify(e));
    }
}
