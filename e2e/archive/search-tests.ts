import Arlula from "../../dist";
import SearchRequest, { GroundSampleDistance } from "../../dist/archive/search-request";
import SearchResponse, { isResponse } from "../../dist/archive/search/response";
import SearchResult from "../../dist/archive/search/result";

export default function runSearchTests(client: Arlula): Promise<unknown> {

    return Promise.all([
        test1(client),
        test2(client),
        test3(client),
        test4(client),
        test5(client),
        testError1(client),
        testError2(client),
        testError3(client),
    ]);

}

// search single date and point
function test1(client: Arlula) {
    console.log("search 1")
    const search = new SearchRequest(new Date(2018, 4, 3))
        .point(151.2108, -33.8523)
        .setMaximumGSD(GroundSampleDistance.medium);
    return client.archive().search(search)
    .then((res) => {
        // search min number, number of results may increase with new suppliers, or be less if suppliers under load
        if (res?.errors) {
            console.error("search 1 - returned errors, ", res.errors);
            return Promise.reject("search 1 - returned error");
        }
        if (!res.results || res.results.length < 1) {
            console.error("search 1 - Insufficient results for search, ", res.results?.length);
            console.log(res);
            return Promise.reject("search 1 - insufficient results");
        }
        let msg: string;
        for (let i=0; i<res.results.length; i++) {
            msg = testResult("search 1", res.results[i]);
            if (msg) {
                return Promise.reject("search 1 - " + msg);
            }
        }
    })
    .catch(exceptionHandler("search 1 - point, date"));
}

// search date range and point
function test2(client: Arlula) {
    console.log("search 2")
    const search = new SearchRequest(new Date(2018, 4, 3))
        .to(new Date(2018, 6, 13))
        .point(151.2108, -33.8523)
        .setMaximumGSD(GroundSampleDistance.medium);
    return client.archive().search(search)
        .then((res) => {
            // search min number, number of results may increase with new suppliers, or be less if suppliers under load
            if (res?.errors) {
                console.error("search 2 - returned errors, ", res.errors);
                return Promise.reject("search 2 - returned error");
            }
            if (!res.results || res.results.length < 1) {
                console.error("search 2 - Insufficient results for search, ", res.results?.length);
                console.log(res);
                return Promise.reject("search 2 - insufficient results");
            }
            let msg: string;
            for (let i=0; i<res.results.length; i++) {
                msg = testResult("search 2", res.results[i]);
                if (msg) {
                    return Promise.reject("search 2 - " + msg);
                }
            }
        })
        .catch(exceptionHandler("search 2 - point, date range"));
}

// check lower res
function test3(client: Arlula) {
    console.log("search 3")
    const search = new SearchRequest(new Date(2018, 4, 3))
        .to(new Date(2018, 6, 13))
        .point(151.2108, -33.8523)
        .setMaximumGSD(GroundSampleDistance.veryLow);
    client.archive().search(search)
    .then((res) => {
        // search min number, number of results may increase with new suppliers, or be less if suppliers under load
        if (res?.errors) {
            console.error("search 3 - returned errors, ", res.errors);
            return Promise.reject("search 3 - returned error");
        }
        if (!res.results || res.results.length < 1) {
            console.error("search 3 - Insufficient results for search, ", res.results?.length);
            console.log(res);
            return Promise.reject("search 3 - insufficient results");
        }
        let msg: string;
        for (let i=0; i<res.results.length; i++) {
            msg = testResult("search 3", res.results[i]);
            if (msg) {
                return Promise.reject("search 3 - " + msg);
            }
        }
    })
    .catch(exceptionHandler("search 3 - point, date range (low res)"));
}

// search date range and bounding box
function test4(client: Arlula) {
    console.log("search 4")
    const search = new SearchRequest(new Date(2018, 5, 15))
        .to(new Date(2020, 6, 13))
        .boundingBox(14.032288, 50.392761, 14.658508, 50.021858)
        .setMaximumGSD(GroundSampleDistance.medium);
    client.archive().search(search)
    .then((res) => {
        // search min number, number of results may increase with new suppliers, or be less if suppliers under load
        if (res?.errors) {
            console.error("search 4 - returned errors, ", res.errors);
            return Promise.reject("search 4 - returned error");
        }
        if (!res.results || res.results.length < 1) {
            console.error("search 4 - Insufficient results for search, ", res.results?.length);
            console.log(res);
            return Promise.reject("search 4 - insufficient results");
        }
        let msg: string;
        for (let i=0; i<res.results.length; i++) {
            msg = testResult("search 4", res.results[i]);
            if (msg) {
                return Promise.reject("search 4 - " + msg);
            }
        }
    })
    .catch(exceptionHandler("search 4 - box, date"));
}

// search single date and bounding box
function test5(client: Arlula) {
    console.log("search 5")
    const search = new SearchRequest(new Date(2020, 5, 15))
        .to(new Date(2020, 8, 13))
        .boundingBox(14.032288, 50.392761, 14.658508, 50.021858)
        .setMaximumGSD(GroundSampleDistance.medium);
    return client.archive().search(search)
        .then((res) => {
            // search min number, number of results may increase with new suppliers, or be less if suppliers under load
            if (res?.errors) {
                console.error("search 5 - returned errors, ", res.errors);
                return Promise.reject("search 5 - returned error");
            }
            if (!res.results || res.results.length < 1) {
                console.error("search 5 - Insufficient results for search, ", res.results?.length);
                console.log(res);
                return Promise.reject("search 5 - insufficient results");
            }
            let msg: string;
            for (let i=0; i<res.results.length; i++) {
                msg = testResult("search 5", res.results[i]);
                if (msg) {
                    return Promise.reject("search 5 - " + msg);
                }
            }
        })
        .catch(exceptionHandler("search 5 - box, date range"));
}

// search errors
    
// end before start
function testError1(client: Arlula) {
    console.log("search error 1")
    const search = new SearchRequest(new Date(2020, 6, 13))
        .to(new Date(2018, 6, 13))
        .point(151.2108, -33.8523)
        .setMaximumGSD(GroundSampleDistance.medium);
    
    return client.archive().search(search)
    .then((r) => {
        console.dir(r);
        return Promise.reject("search error 1 - got results from invalid search");
    })
    .catch((e) => {
        if (!isResponse(e)) {
            console.error("search error 1 - Unexpected error response object (search error 1): ", e?.response?.data)
            console.dir(e)
            return Promise.reject("search error 1 - "+e);
        }
        if (!e.errors || !e.errors[0].startsWith("End date must be after start date")) {
            console.error("search error 1 - Unexpected error response (search error 1): ", e)
            return Promise.reject("search error 1 - "+e);
        }
    });
}

// future date
function testError2(client: Arlula) {
    console.log("search error 2")
    const search = new SearchRequest(new Date(3000, 1, 1))
        .point(151.2108, -33.8523)
        .setMaximumGSD(GroundSampleDistance.medium);

    return client.archive().search(search)
    .then(expectedError("search error 2 - date future"))
    .catch((e) => {
        if (!isResponse(e)) {
            console.error("search error 2 - Unexpected error response object (search error 2): ", e);
            return Promise.reject("search error 2 - "+e);
        }
        if (!e.errors || !e.errors[0].startsWith("Start date must be in the past")) {
            console.error("Unexpected error response (search error 2): ", e);
            return Promise.reject("search error 2 - "+e);
        }
    });
}

// invalid long/lat
function testError3(client: Arlula) {
    console.log("search error 3")
    const search = new SearchRequest(new Date(2018, 5, 15))
        .to(new Date(2020, 6, 13))
        .point(-33.8523, 151.2108)
        .setMaximumGSD(GroundSampleDistance.medium);
    
    return client.archive().search(search)
    .then(expectedError("search error 3 - invalid lat/long"))
    .catch((e) => {
        if (!isResponse(e)) {
            console.error("search error 3 - Unexpected error response object (search error 3): ", e);
            return Promise.reject("search error 3 - "+e);
        }
        if (!e.errors || !e.errors[0].startsWith("Invalid latitude")) {
            console.error("search error 3 - Unexpected error response (search error 3): ", e)
            return Promise.reject("search error 3 - "+e);
        }
    });
}

function exceptionHandler(label: string) {
    return function (e: string) {
        console.error("Error executing " + label + ": ", JSON.stringify(e));
        return Promise.reject(label+": "+JSON.stringify(e));
    }
}

function expectedError(label: string) {
    return function (result: SearchResponse) {
        console.error("Error executing"+label+": ", result);
        return Promise.reject(label+": "+result);
    }
}

function testResult(prefix: string, r: SearchResult): string {
    // bounding
    if (r.bounding.length == 0) {
        console.error(prefix, " is not populated");
        console.log(r);
        return "scene polygon is not populated";
    }
    if (!JSON.stringify(r.bounding).startsWith("[[[")) {
        console.error(prefix, " - scene polygon is not valid");
        console.log(r);
        return "scene polygon is not valid";
    }
    // overlap
    if (r.overlap.area === 0) {
        console.error(prefix, " - scene overlap area is below the expected threshold");
        console.log(r);
        return "scene overlap area is below the expected threshold";
    }
    if (r.overlap.percent.scene < 0.1) {
        console.error(prefix, " - scene overlap percent is below the expected threshold");
        console.log(r);
        return "scene overlap percent is below the expected threshold";
    }
    if (r.overlap.polygon.length == 0) {
        console.error(prefix, " - overlap polygon not populated");
        console.log(r);
        return "overlap polygon not populated";
    }
    if (!JSON.stringify(r.overlap.polygon).startsWith("[[[")) {
        console.error(prefix, " - overlap polygon not valid");
        console.log(r);
        return "overlap polygon not valid";
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
    if (r.license.length == 0) {
        console.error(prefix, " - no license in result");
        console.log(r);
        return "no license in result";
    }
    for (let i = 0; i<r.license.length; i++) {
        if (!r.license[i].name) {
            console.error(prefix, " - invalid license, missing name");
        }
        if (!r.license[i].href) {
            console.error(prefix, " - invalid license, missing href");
        }
        if (r.license[i].loadingPercent == undefined) {
            console.error(prefix, " - invalid license, missing loadingPercent");
        }
        if (r.license[i].loadingAmount == undefined) {
            console.error(prefix, " - invalid license, missing loadingAmount");
        }
    }

    return ""
}
