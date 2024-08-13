import Arlula from "../../dist";
import TaskingSearchRequest from "../../dist/tasking/search-request";
import { TaskingSearchResponse, TaskingSearchResult } from "../../dist/tasking/search-response";
import { GroundSampleDistance } from "../../dist/util/gsd";

const tests = [
    test1,
];

export default function runSearchTests(client: Arlula): Promise<unknown> {

    return tests.reduce((p, test) => {
        return p.then(() => test(client));
     }, Promise.resolve()); // initial

}

// search single date and point
function test1(client: Arlula) {
    console.log("tasking search 1")
    const currentMonth = (new Date()).getMonth();
    const start = new Date();
    const end = new Date();
    end.setMonth(currentMonth+2);
    const search = new TaskingSearchRequest(start, end)
        .point(151.2108, -33.8523);
    return client.tasking().search(search)
    .then((res) => {
        // search min number, number of results may increase with new suppliers, or be less if suppliers under load
        if (res?.errors) {
            console.error("tasking search 1 - returned errors, ", res.errors);
            return Promise.reject("search 1 - returned error");
        }
        if (!res.results || res.results.length < 1) {
            console.error("tasking search 1 - Insufficient results for search, ", res.results?.length);
            console.log(res);
            return Promise.reject("tasking search 1 - insufficient results");
        }
        let msg: string;
        for (let i=0; i<res.results.length; i++) {
            msg = testResult("tasking search 1", res.results[i]);
            if (msg) {
                return Promise.reject("tasking search 1 - " + msg);
            }
        }
    })
    .catch(exceptionHandler("tasking search 1 - point, date"));
}


function exceptionHandler(label: string) {
    return function (e: string) {
        console.error("Error executing " + label + ": ", JSON.stringify(e));
        return Promise.reject(label+": "+JSON.stringify(e));
    }
}

function expectedError(label: string) {
    return function (result: TaskingSearchResponse) {
        console.error("Error executing"+label+": ", result);
        return Promise.reject(label+": "+result);
    }
}

function testResult(prefix: string, r: TaskingSearchResult): string {
    // bounding
    if (r.polygon.length == 0) {
        console.error(prefix, " is not populated");
        console.log(r);
        return "scene polygon is not populated";
    }
    if (!JSON.stringify(r.polygon).startsWith("[[[")) {
        console.error(prefix, " - scene polygon is not valid");
        console.log(r);
        return "scene polygon is not valid";
    }
    // bands
    if (r.bands.length == 0) {
        console.error(prefix, " - no bands in result");
        console.log(r);
        return "no bands in result";
    }
    for (let i = 0; i<r.bands.length; i++) {
        if (!r.bands[i].id) {
            console.error(prefix, " - invalid band, missing id");
            console.log(r.bands[i]);
            return "invalid band, missing id";
        }
        if (!r.bands[i].name) {
            console.error(prefix, " - invalid band, missing name");
            console.log(r.bands[i]);
            return "invalid band, missing name";
        }
        if (!r.bands[i].min) {
            console.error(prefix, " - invalid band, missing min");
            console.log(r.bands[i]);
            return "invalid band, missing min";
        }
        if (!r.bands[i].max) {
            console.error(prefix, " - invalid band, missing max");
            console.log(r.bands[i]);
            return "invalid band, missing max";
        }
    }
    // bundles
    if (r.bundles.length == 0) {
        console.error(prefix, " - no ordering bundles in result");
        console.log(r);
        return "no ordering bundles in result";
    }
    for (let i = 0; i<r.bundles.length; i++) {
        if (!r.bundles[i].name) {
            console.error(prefix, " - invalid bundle, missing name");
            console.log(r.bundles[i]);
            return "invalid bundle, missing name";
        }
        if (!r.bundles[i].key) {
            console.error(prefix, " - invalid bundle, missing key");
            console.log(r.bundles[i]);
            return "invalid bundle, missing key";
        }
        if (!r.bundles[i].bands) {
            console.error(prefix, " - invalid bundle, missing bands");
            console.log(r.bundles[i]);
            return "invalid bundle, missing bands";
        }
        if (r.bundles[i].price == undefined) {
            console.error(prefix, " - invalid bundle, missing price");
            console.log(r.bundles[i]);
            return "invalid bundle, missing price";
        }
    }
    // license
    if (r.licenses.length == 0) {
        console.error(prefix, " - no licenses in result");
        console.log(r);
        return "no licenses in result";
    }
    for (let i = 0; i<r.licenses.length; i++) {
        if (!r.licenses[i].name) {
            console.error(prefix, " - invalid license, missing name");
        }
        if (!r.licenses[i].href) {
            console.error(prefix, " - invalid license, missing href");
        }
        if (r.licenses[i].loadingPercent == undefined) {
            console.error(prefix, " - invalid license, missing loadingPercent");
        }
        if (r.licenses[i].loadingAmount == undefined) {
            console.error(prefix, " - invalid license, missing loadingAmount");
        }
    }

    return ""
}
