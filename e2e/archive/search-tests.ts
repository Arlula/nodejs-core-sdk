import { AxiosError } from "axios";
import Arlula from "../../src";
import SearchRequest, { Resolution } from "../../src/archive/search-request";
import SearchResult from "../../src/archive/search-result";

export default function runSearchTests(client: Arlula): void {
    // search single date and point
    const search = new SearchRequest(new Date("2018-04-03"));
    search.searchPoint(151.2108, -33.8523);
    search.setMaximumResolution(Resolution.medium)
    client.archive().Search(search)
        .then((res) => {
            // search min number, number of results may increase with new suppliers, or be less if suppliers under load
            if (res.length < 1) {
                console.error("Insufficient results for search, ", res.length);
                console.log(res)
            }
        })
        .catch(exceptionHandler("search 1 - point, date"));

    // search date range and point
    search.searchTo(new Date("2018-06-13"));
    client.archive().Search(search)
        .then((res) => {
            // search min number, number of results may increase with new suppliers, or be less if suppliers under load
            if (res.length < 1) {
                console.error("Insufficient results for search, ", res.length);
                console.log(res)
            }
        })
        .catch(exceptionHandler("search 2 - point, date range"));

    // check lower res
    search.setMaximumResolution(Resolution.veryLow);
    client.archive().Search(search)
        .then((res) => {
            // search min number, number of results may increase with new suppliers, or be less if suppliers under load
            if (res.length < 10) {
                console.error("Insufficient results for search, ", res.length);
                console.log(res)
            }
        })
        .catch(exceptionHandler("search 3 - point, date range (low res)"));

    // search date range and bounding box
    search.setMaximumResolution(Resolution.medium);
    search.searchDate(new Date("2020-05-15"))
    search.searchBoundingBox(14.658508, 50.392761, 14.032288, 50.021858);
    client.archive().Search(search)
        .then((res) => {
            // search min number, number of results may increase with new suppliers, or be less if suppliers under load
            if (res.length < 1) {
                console.error("Insufficient results for search, ", res.length);
                console.log(res)
            }
        })
        .catch(exceptionHandler("search 4 - box, date"));


    // search single date and bounding box
    search.searchTo(new Date("2020-06-13"));
    client.archive().Search(search)
        .then((res) => {
            // search min number, number of results may increase with new suppliers, or be less if suppliers under load
            if (res.length < 1) {
                console.error("Insufficient results for search, ", res.length);
                console.log(res)
            }
        })
        .catch(exceptionHandler("search 5 - box, date range"));

    // search errors
    
    // end before start
    search.searchTo(new Date("2018-06-13"));
    client.archive().Search(search)
    .then(expectedError("search error 1 - error, end before start"))
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("Unexpected error response object (search error 1): ", e)
            return;
        }
        if (!e.startsWith("End date must be after start date")) {
            console.error("Unexpected error response (search error 1): ", e)
        }
    });

    // future date
    search.searchDate(new Date("3000-01-01"));
    client.archive().Search(search)
    .then(expectedError("search error 2 - date future"))
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("Unexpected error response object (search error 2): ", e)
            return;
        }
        if (!e.startsWith("Start Date must be in the past")) {
            console.error("Unexpected error response (search error 2): ", e)
        }
    });

    // invalid long/lat
    search.searchDate(new Date("2018-06-13"));
    search.searchPoint(-33.8523, 151.2108);
    client.archive().Search(search)
    .then(expectedError("search error 3 - invalid lat/long"))
    .catch((e) => {
        if (typeof e !== "string") {
            console.error("Unexpected error response object (search error 3): ", e)
            return;
        }
        if (!e.startsWith("Invalid Latitude")) {
            console.error("Unexpected error response (search error 3): ", e)
        }
    });

}

function exceptionHandler(label: string) {
    return function (e: string|AxiosError) {
        console.error("Error executing " + label + ": ", e);
    }
}

function expectedError(label: string) {
    return function (result: SearchResult[]) {
        console.error("Error executing"+label+": ", result);
    }
}
