import fs, { WriteStream } from "fs";
import Arlula from "../../dist/index";

const tests = [
    test1,
    test2,
    test3,
    test4,
];

export default function runOrderResourceTests(client: Arlula): Promise<unknown> {

    return tests.reduce((p, test) => {
        return p.then(() => test(client));
     }, Promise.resolve()); // initial

}

// order get => child resource => download
function test1(client: Arlula) {
    console.log("resource get 1");
    return client.orders().getDataset(process.env.order_id || "")
    .then((order) => {
        if (!order.resources.length) {
            console.error("resource 1, Get order returned no resources");
            return Promise.reject("Get order returned no resources");
        }

        let found = false;
        order.resources.forEach((resource) => {
            if (resource.format.includes("application/json")) {
                found = true;
                resource.download()
                .then((data) => {
                    if (!(data instanceof ArrayBuffer)) {
                        console.error("resource 1, unexpected resource data type: ", arrayBufferToString(data));
                        return Promise.reject(data);
                    }
                    if (data.byteLength < 100) {
                        console.error("resource 1, unexpected resource length: ", data.byteLength);
                        console.log(arrayBufferToString(data))
                        return Promise.reject("resource 1, unexpected resource length: "+ data.byteLength);
                    }
                })
                .catch((e) => {
                    if (e instanceof ArrayBuffer || e instanceof Buffer) {
                        console.error("resource 1, unexpected error getting resource: ", arrayBufferToString(e));
                    } else {
                        console.error("resource 1, unexpected error getting resource: ", e);
                    }
                    return Promise.reject("resource 1, unexpected error getting resource: "+e);
                });
            }
        });
        if (!found) {
            console.error("error, no valid resource found to retrieve");
            return Promise.reject("no valid resource found to retrieve");
        }
    })
    .catch((e) => {
        console.error("resource 1, unexpected outer error getting resource: ",e);
        return Promise.reject("resource 1, unexpected outer error getting resource: "+e);
    })
}

// client => resource download
function test2(client: Arlula) {
    console.log("resource get 2");
    return client.orders().downloadResource(process.env.resource_id || "")
    .then((data) => {
        if (!(data instanceof ArrayBuffer)) {
            console.error("resource 2, unexpected resource data type: ", arrayBufferToString(data));
            return Promise.reject(data);
        }
        if (data.byteLength < 100) {
            console.error("resource 2, unexpected resource length: ", data.byteLength);
            console.log(arrayBufferToString(data))
            return Promise.reject("resource 2, unexpected resource length: "+ data.byteLength);
        }
    })
    .catch((e) => {
        if (e instanceof ArrayBuffer || e instanceof Buffer) {
            console.error("resource 2, unexpected error getting resource: ", arrayBufferToString(e));
        } else {
            console.error("resource 2, unexpected error getting resource: ", e);
        }
        return Promise.reject("resource 2, unexpected error getting resource: "+e);
    });
}

// client => resource download to file
function test3(client: Arlula) {
    console.log("resource get 3");
    return client.orders().downloadResourceToFile(process.env.resource_id || "", process.env.resource_file1 || "temp/res_dl_test_1")
    .then(async (data) => {
        if (!(data instanceof WriteStream)) {
            console.error("resource 3, unexpected resource data type: ", data);
            return Promise.reject(data);
        }
        if (data.path != (process.env.resource_file1 || "temp/res_dl_test_1")) {
            console.error("resource 3, unexpected download path: ", data.path);
            return Promise.reject("resource 3, unexpected download path: " + data.path);
        }
        data.close()
        
        // can just let exception bubble to containing try, raw await
        await new Promise((resolve, reject) => {
            fs.stat(process.env.resource_file1 || "temp/res_dl_test_1", (err, stat) => {
                if (err) {
                    reject(err);
                    return;
                }
    
                if (stat.size < 100) {
                    reject("unexpected resource length: "+ stat.size);
                    return;
                }
                resolve(null);
            })
        });
    })
    .catch((e) => {
        if (e instanceof ArrayBuffer || e instanceof Buffer) {
            console.error("resource 3, unexpected error getting resource: ", arrayBufferToString(e));
        } else {
            console.error("resource 3, unexpected error getting resource: ", e);
        }
        return Promise.reject("resource 3, unexpected error getting resource: "+e);
    });
}

// client => resource download to file (with file)
function test4(client: Arlula) {
    console.log("resource get 4");
    const file = fs.createWriteStream(process.env.resource_file2 || "temp/res_dl_test_2", { 
        flags: "w+",
        mode: 0o644,
    });
    return client.orders().downloadResourceToFile(process.env.resource_id || "", file)
    .then(async (data) => {
        if (!(data instanceof WriteStream)) {
            console.error("resource 4, unexpected resource data type: ", data);
            return Promise.reject(data);
        }
        if (data.path != (process.env.resource_file2 || "temp/res_dl_test_2")) {
            console.error("resource 4, unexpected download path: ", data.path);
            return Promise.reject("resource 4, unexpected download path: " + data.path);
        }
        if (data !== file) {
            console.error("resource 4, file reference has changed");
            return Promise.reject("resource 4, file reference has changed");
        }
        data.close()

        // can just let exception bubble to containing try, raw await
        await new Promise((resolve, reject) => {
            fs.stat(process.env.resource_file2 || "temp/res_dl_test_2", (err, stat) => {
                if (err) {
                    reject(err);
                    return;
                }
    
                if (stat.size < 100) {
                    reject("unexpected resource length: "+ stat.size);
                    return;
                }
                resolve(null);
            })
        });
    })
    .catch((e) => {
        if (e instanceof ArrayBuffer || e instanceof Buffer) {
            console.error("resource 4, unexpected error getting resource: ", arrayBufferToString(e));
        } else {
            console.error("resource 4, unexpected error getting resource: ", e);
        }
        return Promise.reject("resource 3, unexpected error getting resource: "+e);
    });
}

function arrayBufferToString(buf: ArrayBuffer): string {
    // std lib typings enforce an argument of 'number[]' and don't handle
    // the newer numeric array types like Uint8Array 
    // as a result this converts to unknown then to number array for type purposes
    return String.fromCharCode.apply(null, new Uint8Array (buf) as unknown as number[]);
}
