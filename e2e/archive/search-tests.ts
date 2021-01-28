import { AxiosError } from "axios";
import Arlula from "../../dist";
import SearchRequest, { Resolution } from "../../dist/archive/search-request";
import SearchResult from "../../dist/archive/search-result";

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
    const search = new SearchRequest(new Date("2018-04-03"))
        .point(151.2108, -33.8523)
        .setMaximumResolution(Resolution.medium);
    return client.archive().search(search)
    .then((res) => {
        // search min number, number of results may increase with new suppliers, or be less if suppliers under load
        if (res.length < 1) {
            console.error("Insufficient results for search, ", res.length);
            console.log(res);
            return Promise.reject("insufficient results");
        }
    })
    .catch(exceptionHandler("search 1 - point, date"));
}

// search date range and point
function test2(client: Arlula) {
    const search = new SearchRequest(new Date("2018-04-03"))
        .to(new Date("2018-06-13"))
        .point(151.2108, -33.8523)
        .setMaximumResolution(Resolution.medium);
    return client.archive().search(search)
        .then((res) => {
            // search min number, number of results may increase with new suppliers, or be less if suppliers under load
            if (res.length < 1) {
                console.error("Insufficient results for search, ", res.length);
                console.log(res);
                return Promise.reject("insufficient results");
            }
        })
        .catch(exceptionHandler("search 2 - point, date range"));
}

// check lower res
function test3(client: Arlula) {
    const search = new SearchRequest(new Date("2018-04-03"))
        .to(new Date("2018-06-13"))
        .point(151.2108, -33.8523)
        .setMaximumResolution(Resolution.veryLow);
    client.archive().search(search)
    .then((res) => {
        // search min number, number of results may increase with new suppliers, or be less if suppliers under load
        if (res.length < 10) {
            console.error("Insufficient results for search, ", res.length);
            console.log(res)
            return Promise.reject("insufficient results");
        }
    })
    .catch(exceptionHandler("search 3 - point, date range (low res)"));
}

// search date range and bounding box
function test4(client: Arlula) {
    const search = new SearchRequest(new Date("2020-05-15"))
        .to(new Date("2018-06-13"))
        .boundingBox(14.658508, 50.392761, 14.032288, 50.021858)
        .setMaximumResolution(Resolution.medium);
    client.archive().search(search)
    .then((res) => {
        // search min number, number of results may increase with new suppliers, or be less if suppliers under load
        if (res.length < 1) {
            console.error("Insufficient results for search, ", res.length);
            console.log(res)
            return Promise.reject("insufficient results");
        }
    })
    .catch(exceptionHandler("search 4 - box, date"));
}

// search single date and bounding box
function test5(client: Arlula) {
    const search = new SearchRequest(new Date("2020-05-15"))
        .to(new Date("2020-06-13"))
        .boundingBox(14.658508, 50.392761, 14.032288, 50.021858)
        .setMaximumResolution(Resolution.medium);
    return client.archive().search(search)
        .then((res) => {
            // search min number, number of results may increase with new suppliers, or be less if suppliers under load
            if (res.length < 1) {
                console.error("Insufficient results for search, ", res.length);
                console.log(res)
                return Promise.reject("insufficient results");
            }
        })
        .catch(exceptionHandler("search 5 - box, date range"));
}

// search errors
    
// end before start
function test6(client: Arlula) {
    const search = new SearchRequest(new Date("2018-06-13"))
        .to(new Date("2020-06-13"))
        .point(151.2108, -33.8523)
        .setMaximumResolution(Resolution.medium);
    
    return client.archive().search(search)
    .then(expectedError("search error 1 - error, end before start"))
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("Unexpected error response object (search error 1): ", e?.response?.data)
            console.dir(e)
            return Promise.reject(e);
        }
        if (!e.startsWith("End date must be after start date")) {
            console.error("Unexpected error response (search error 1): ", e)
            return Promise.reject(e);
        }
    });
}

// future date
function test7(client: Arlula) {
    const search = new SearchRequest(new Date("3000-01-01"))
        .point(151.2108, -33.8523)
        .setMaximumResolution(Resolution.medium);

    return client.archive().search(search)
    .then(expectedError("search error 2 - date future"))
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("Unexpected error response object (search error 2): ", e?.response?.data)
            console.dir(e)
            return Promise.reject(e);
        }
        if (!e.startsWith("Start Date must be in the past")) {
            console.error("Unexpected error response (search error 2): ", e)
            return Promise.reject(e);
        }
    });
}

// invalid long/lat
function test8(client: Arlula) {
    const search = new SearchRequest(new Date("2020-05-15"))
        .to(new Date("2018-06-13"))
        .point(-33.8523, 151.2108)
        .setMaximumResolution(Resolution.medium);
    
    return client.archive().search(search)
    .then(expectedError("search error 3 - invalid lat/long"))
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("Unexpected error response object (search error 3): ", e?.response?.data)
            console.dir(e)
            return Promise.reject(e);
        }
        if (!e.startsWith("Invalid Latitude")) {
            console.error("Unexpected error response (search error 3): ", e)
            return Promise.reject(e);
        }
    });
}

function exceptionHandler(label: string) {
    return function (e: string|AxiosError) {
        console.error("Error executing " + label + ": ", e);
        return Promise.reject(e);
    }
}

function expectedError(label: string) {
    return function (result: SearchResult[]) {
        console.error("Error executing"+label+": ", result);
        return Promise.reject(result);
    }
}
