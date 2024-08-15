import Arlula from "../../dist/index";
import { StatusCode } from "../../dist/orders/status";


const tests = [
    orderListTest,
    campaignListTest,
    datasetListTest,
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
    console.log("Order list")
    return client.orders().orderList()
    .then(async (ordList) => {
        if (ordList.page != 0) {
            console.log("Order list - base list with non-zero page");
            return Promise.reject("Order list - base list with non-zero page");
        }
        if (ordList.length != 20) {
            console.log("Order list - base page without page length specified");
            return Promise.reject("Order list - base page without page length specified");
        }
        if (!ordList.count || !ordList.content.length) {
            console.log("Order list - list empty, expecting existing list");
            return Promise.reject("Order list - list empty, expecting existing list");
        }
        for (let i=0; i<ordList.count; i++) {
            if (!ordList.content[i].id) {
                console.log("order list - received order in list with no ID");
                return Promise.reject("Order list - received order in list with no ID");
            }
            try {
                const c = await ordList.content[i].campaigns;
                const d = await ordList.content[i].datasets;
                if (!(c.length || d.length)) {
                    console.log("order list - received order in list with no content campaigns or datasets");
                    return Promise.reject("Order list - received order in list with no content campaigns or datasets");
                }
            } catch(e) {
                return Promise.reject("Error accessing order sub resources: "+e)
            }
        }
        
    })
    .catch((e) => {
        console.error("Order list - unexpected error getting order list: ", e);
        return Promise.reject("Order list - "+e);
    });

}

function campaignListTest(client: Arlula) {
    console.log("Campaign list")
    return client.orders().campaignList()
    .then(async (campaignList) => {
        if (campaignList.page != 0) {
            console.log("Campaign list - base list with non-zero page");
            return Promise.reject("Campaign list - base list with non-zero page");
        }
        if (campaignList.length != 20) {
            console.log("Campaign list - base page without page length specified");
            return Promise.reject("Campaign list - base page without page length specified");
        }
        if (!campaignList.count || !campaignList.content.length) {
            console.log("Campaign list - list empty, expecting existing list");
            return Promise.reject("Campaign list - list empty, expecting existing list");
        }
        for (let i=0; i<campaignList.count; i++) {
            if (!campaignList.content[i].id) {
                console.log("Campaign list - received campaign in list with no ID");
                return Promise.reject("Campaign list - received campaign in list with no ID");
            }
            const d = await campaignList.content[i].datasets;
            if (campaignList.content[i].status == StatusCode.Complete && !d.length) {
                console.log("Campaign list - received campaign in list with no content datasets");
                return Promise.reject("Campaign list - received campaign in list with no content datasets");
            }
        }
        
    })
    .catch((e) => {
        console.error("Campaign list - unexpected error getting campaign list: ", e);
        return Promise.reject("Campaign list - "+e);
    });

}

function datasetListTest(client: Arlula) {
    console.log("Dataset list")
    return client.orders().datasetList()
    .then(async (datasetList) => {
        if (datasetList.page != 0) {
            console.log("Dataset list - base list with non-zero page");
            return Promise.reject("Dataset list - base list with non-zero page");
        }
        if (datasetList.length != 20) {
            console.log("Dataset list - base page without page length specified");
            return Promise.reject("Dataset list - base page without page length specified");
        }
        if (!datasetList.count || !datasetList.content.length) {
            console.log("Dataset list - list empty, expecting existing list");
            return Promise.reject("Dataset list - list empty, expecting existing list");
        }
        for (let i=0; i<datasetList.count; i++) {
            if (!datasetList.content[i].id) {
                console.log("Dataset list - received dataset in list with no ID");
                return Promise.reject("Dataset list - received dataset in list with no ID");
            }
            if (datasetList.content[i].status == StatusCode.Complete && !datasetList.content[i].resources) {
                console.log("Dataset list - received dataset in list with no content resources");
                return Promise.reject("Dataset list - received dataset in list with no content resources");
            }
        }
        
    })
    .catch((e) => {
        console.error("Dataset list - unexpected error getting dataset list: ", e);
        return Promise.reject("Dataset list - "+e);
    });

}
