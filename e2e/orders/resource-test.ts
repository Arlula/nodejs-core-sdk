import fs, { WriteStream } from "fs";
import Arlula from "../../dist/index";

export default function runOrderResourceTests(client: Arlula): Promise<unknown> {

    return Promise.all([
        test1(client),
        test2(client),
        test3(client),
        test4(client),
    ]);

}

// order get => child resource => download
function test1(client: Arlula) {
    console.log("resource get 1");
    return client.orders().get(process.env.order_id || "")
    .then((order) => {
        if (!order.resources.length) {
            console.error("resource 1, Get order returned no resources");
            return Promise.reject("Get order returned no resources");
        }

        order.resources.forEach((resource) => {
            if (resource.type == "meta_json") {
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
        })
    });
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
    return client.orders().downloadResourceToFile(process.env.resource_id || "", process.env.resource_file1 || "res_dl_test_1")
    .then((data) => {
        if (!(data instanceof WriteStream)) {
            console.error("resource 3, unexpected resource data type: ", data);
            return Promise.reject(data);
        }
        if (data.path != (process.env.resource_file1 || "res_dl_test_1")) {
            console.error("resource 3, unexpected download path: ", data.path);
            return Promise.reject("resource 3, unexpected download path: " + data.path);
        }
        data.close()
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
    const file = fs.createWriteStream(process.env.resource_file2 || "res_dl_test_2", { 
        flags: "w+",
        mode: 0o644,
    });
    return client.orders().downloadResourceToFile(process.env.resource_id || "", file)
    .then((data) => {
        if (!(data instanceof WriteStream)) {
            console.error("resource 4, unexpected resource data type: ", data);
            return Promise.reject(data);
        }
        if (data.path != (process.env.resource_file2 || "res_dl_test_2")) {
            console.error("resource 4, unexpected download path: ", data.path);
            return Promise.reject("resource 4, unexpected download path: " + data.path);
        }
        if (data !== file) {
            console.error("resource 4, file reference has changed");
            return Promise.reject("resource 4, file reference has changed");
        }
        data.close()
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
    // std lib typings enforce an argument of 'number[]' and dont handle
    // the newer numeric array types like Uint8Array 
    // as a result this converts to unknown then to number array for type purposes
    return String.fromCharCode.apply(null, new Uint8Array (buf) as unknown as number[]);
}
