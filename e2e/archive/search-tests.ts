import Arlula from "../../dist";
import SearchRequest, { Resolution } from "../../dist/archive/search-request";
import SearchResponse, { isResponse } from "../../dist/archive/search/response";

export default function runSearchTests(client: Arlula): Promise<unknown> {

    return Promise.all([
        test1(client),
        test2(client),
        test3(client),
        test4(client),
        test5(client),
        test6(client),
        test7(client),
        test8(client),
    ]);

}

// search single date and point
function test1(client: Arlula) {
    console.log("search 1")
    const search = new SearchRequest(new Date(2018, 4, 3))
        .point(151.2108, -33.8523)
        .setMaximumResolution(Resolution.veryLow);
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
        for (let i=0; i<res.results.length; i++) {
            const r = res.results[i];
            // bounding
            if (r.bounding.length == 0) {
                console.error("search 1 - scene polygon is not populated");
                console.log(r);
                return Promise.reject("search 1 - scene polygon is not populated");
            }
            if (!JSON.stringify(r.bounding).startsWith("[[[")) {
                console.error("search 1 - scene polygon is not valid");
                console.log(r);
                return Promise.reject("search 1 - scene polygon is not valid");
            }
            // overlap
            if (r.overlap.area === 0) {
                console.error("search 1 - scene overlap area is below the expected threshold");
                console.log(r);
                return Promise.reject("search 1 - scene overlap area is below the expected threshold");
            }
            if (r.overlap.percent.scene < 1) {
                console.error("search 1 - scene overlap percent is below the expected threshold");
                console.log(r);
                return Promise.reject("search 1 - scene overlap percent is below the expected threshold");
            }
            if (r.overlap.polygon.length == 0) {
                console.error("search 1 - overlap polygon not populated");
                console.log(r);
                return Promise.reject("search 1 - overlap polygon not populated");
            }
            if (!JSON.stringify(r.overlap.polygon).startsWith("[[[")) {
                console.error("search 1 - overlap polygon not valid");
                console.log(r);
                return Promise.reject("search 1 - overlap polygon not valid");
            }
            // bands
            // TODO: enable this once 2022-07 is live on all servers
            // if (r.bands.length == 0) {
            //     console.error("search 1 - no bands in result");
            //     console.log(r);
            //     return Promise.reject("search 1 - no bands in result");
            // }
            // bundles
            if (r.bundles.length == 0) {
                console.error("search 1 - no ordering bundles in result");
                console.log(r);
                return Promise.reject("search 1 - no ordering bundles in result");
            }
            // license
            if (r.license.length == 0) {
                console.error("search 1 - no license in result");
                console.log(r);
                return Promise.reject("search 1 - no license in result");
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
        .setMaximumResolution(Resolution.medium);
    return client.archive().search(search)
        .then((res) => {
            // search min number, number of results may increase with new suppliers, or be less if suppliers under load
            if (!res.results || res.results.length < 1) {
                console.error("search 2 - Insufficient results for search, ", res.results?.length);
                console.log(res);
                return Promise.reject("search 2 - insufficient results");
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
        .setMaximumResolution(Resolution.veryLow);
    client.archive().search(search)
    .then((res) => {
        // search min number, number of results may increase with new suppliers, or be less if suppliers under load
        if (!res.results || res.results.length < 10) {
            console.error("search 3 - Insufficient results for search, ", res.results?.length);
            console.log(res)
            return Promise.reject("search 3 - insufficient results");
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
        .setMaximumResolution(Resolution.medium);
    client.archive().search(search)
    .then((res) => {
        // search min number, number of results may increase with new suppliers, or be less if suppliers under load
        if (!res.results || res.results.length < 1) {
            console.error("search 4 - Insufficient results for search, ", res.results?.length);
            console.log(res)
            return Promise.reject("search 4 - insufficient results");
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
        .setMaximumResolution(Resolution.medium);
    return client.archive().search(search)
        .then((res) => {
            // search min number, number of results may increase with new suppliers, or be less if suppliers under load
            if (!res.results || res.results.length < 1) {
                console.error("search 5 - Insufficient results for search, ", res.results?.length);
                console.log(res)
                return Promise.reject("search 5 - insufficient results");
            }
        })
        .catch(exceptionHandler("search 5 - box, date range"));
}

// search errors
    
// end before start
function test6(client: Arlula) {
    console.log("search 6")
    const search = new SearchRequest(new Date(2020, 6, 13))
        .to(new Date(2018, 6, 13))
        .point(151.2108, -33.8523)
        .setMaximumResolution(Resolution.medium);
    
    return client.archive().search(search)
    .then((r) => {
        console.dir(r);
        return Promise.reject("search 6, error 1 - got results from invalid search");
    })
    .catch((e) => {
        if (!isResponse(e)) {
            console.error("search 6, error 1 - Unexpected error response object (search error 1): ", e?.response?.data)
            console.dir(e)
            return Promise.reject("search 6, error 1 - "+e);
        }
        if (!e.errors || !e.errors[0].startsWith("End date must be after start date")) {
            console.error("search 6, error 1 - Unexpected error response (search error 1): ", e)
            return Promise.reject("search 6, error 1 - "+e);
        }
    });
}

// future date
function test7(client: Arlula) {
    console.log("search 7")
    const search = new SearchRequest(new Date(3000, 1, 1))
        .point(151.2108, -33.8523)
        .setMaximumResolution(Resolution.medium);

    return client.archive().search(search)
    .then(expectedError("search 7, error 2 - date future"))
    .catch((e) => {
        if (!isResponse(e)) {
            console.error("search 7, error 2 - Unexpected error response object (search error 2): ", e);
            return Promise.reject("search 7, error 2 - "+e);
        }
        if (!e.errors || !e.errors[0].startsWith("Start Date must be in the past")) {
            console.error("Unexpected error response (search error 2): ", e);
            return Promise.reject("search 7, error 2 - "+e);
        }
    });
}

// invalid long/lat
function test8(client: Arlula) {
    console.log("search 8")
    const search = new SearchRequest(new Date(2018, 5, 15))
        .to(new Date(2020, 6, 13))
        .point(-33.8523, 151.2108)
        .setMaximumResolution(Resolution.medium);
    
    return client.archive().search(search)
    .then(expectedError("search 8, error 3 - invalid lat/long"))
    .catch((e) => {
        if (!isResponse(e)) {
            console.error("search 8, error 3 - Unexpected error response object (search error 3): ", e);
            return Promise.reject("search 8, error 3 - "+e);
        }
        if (!e.errors || !e.errors[0].startsWith("Invalid Latitude")) {
            console.error("search 8, error 3 - Unexpected error response (search error 3): ", e)
            return Promise.reject("search 8, error 3 - "+e);
        }
    });
}

function exceptionHandler(label: string) {
    return function (e: string) {
        console.error("Error executing " + label + ": ", e);
        return Promise.reject(label+": "+e);
    }
}

function expectedError(label: string) {
    return function (result: SearchResponse) {
        console.error("Error executing"+label+": ", result);
        return Promise.reject(label+": "+result);
    }
}
