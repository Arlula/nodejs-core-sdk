import Arlula from "../../dist/index";
import Dataset from "../../dist/orders/dataset";
import Order from "../../dist/orders/order";
import { StatusCode } from "../../dist/orders/status";

const tests = [
    orderTest1,
    campaignTest1,
    datasetTest1,
    datasetTest2,
    datasetTest3,
];

export default function runOrderGetTests(client: Arlula): Promise<unknown> {

    return tests.reduce((p, test) => {
        return p.then(() => test(client));
     }, Promise.resolve()); // initial

}


// ===========
//   orders
// ===========

// get direct
function orderTest1(client: Arlula) {
    console.log("order get 1")
    return client.orders().getOrder(process.env.order_id || "")
    .then(async (order) => {
        if (!order.id) {
            console.error("order get 1, got empty order");
            return Promise.reject("order get 2, got empty order");
        }

        try {
            const c = await order.campaigns;
            const d = await order.datasets;
            if (!(c.length || d.length)) {
                console.log("order get 1 - received order in list with no content campaigns or datasets");
                return Promise.reject("Order get 1 - received order in list with no content campaigns or datasets");
            }
        } catch(e) {
            return Promise.reject("Error accessing order sub resources: "+e)
        }
    })
    .catch((e) => {
        console.error("order get 1, unexpected error getting order: ", e);
        return Promise.reject("order get 1, unexpected error getting order: "+e)
    });
}

// ===========
//  campaigns
// ===========

// get direct
function campaignTest1(client: Arlula) {
    console.log("campaign get 1")
    return client.orders().getCampaign(process.env.campaign_id || "")
    .then(async (campaign) => {
        if (!campaign.id) {
            console.error("campaign get 1, got empty campaign");
            return Promise.reject("campaign get 2, got empty campaign");
        }

    const d = await campaign.datasets;
        if (campaign.status == StatusCode.Complete && !d.length) {
            console.log("Campaign get 1 - received campaign with no content datasets");
            return Promise.reject("Campaign get 1 - received campaign with no content datasets");
        }
    })
    .catch((e) => {
        console.error("campaign get 1, unexpected error getting campaign: ", e);
        return Promise.reject("campaign get 1, unexpected error getting campaign: "+e)
    });
}

// ===========
//  datasets
// ===========

// get from list
function datasetTest1(client: Arlula) {
    console.log("dataset get 1")
    return client.orders().datasetList()
    .then((list) => {
        if (!list.length && list.content.length) {
            console.error("dataset get 1, failed to get list to check against");
            return Promise.reject("dataset get 1, failed to get list to check against");
        }
        let sub: Dataset = list.content[0];
        for (let i=0; i<list.length; i++) {
            if (list.content[i].status === StatusCode.Complete && !list.content[i].expiration) {
                sub = list.content[i];
                break;
            }
        }
    
        if (sub.status !== StatusCode.Complete || sub.expiration) {
            console.error("dataset get 1, no suitable datasets found to get");
            return Promise.reject("dataset get 1, no suitable datasets found to get");
        }
    
        return sub.loadResources()
        .then((res) => {
            if (!res.length) {
                console.error("dataset get 1, get dataset resources returned empty array");
                return Promise.reject("dataset get 1, get dataset resources returned empty array");
            }
        })
        .catch((e) => {
            console.error("dataset get 1, error getting dataset: ", e);
            return Promise.reject("dataset get 1: "+e);
        });
    })
    .catch((e) => {
        console.error("dataset get 1, unexpected error getting dataset: ", e);
        return Promise.reject("dataset get 1: "+e)
    });
}


// get direct
function datasetTest2(client: Arlula) {
    console.log("dataset get 2")
    return client.orders().getDataset(process.env.dataset_id || "")
    .then((dataset) => {
        if (!dataset.id) {
            console.error("dataset get 2, got empty dataset");
            return Promise.reject("dataset get 2, got empty dataset");
        }

        if (!dataset.resources.length) {
            console.error("dataset get 2, get dataset did not return resources");
            return Promise.reject("dataset get 2, get dataset did not return resources");
        }
    })
    .catch((e) => {
        console.error("dataset get 2, unexpected error getting dataset: ", e);
        return Promise.reject("dataset get 2, unexpected error getting dataset: "+e)
    });
}

// get invalid ID
// changing version to 6 (invalid version) to invalidate ID
function datasetTest3(client: Arlula) {
    console.log("dataset get 3")
    const tmpID = process.env.dataset_id || "";
    const id = `${tmpID.substr(0,14)}6${tmpID.substr(15)}`;
    return client.orders().getDataset(id)
    .then((dataset) => {
        console.error("dataset get 3, got dataset from invalid ID: ", dataset);
        return Promise.reject("dataset get 3, got dataset from invalid ID: "+dataset);
    })
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("dataset get 3, unexpected error object: ", e);
        }
        if (e.startsWith("No permission to dataset")) {
            // success case
            return;
        }
        console.error("dataset get 3, unexpected error: ", e);
        return Promise.reject("dataset get 3: "+e);
    });
}
