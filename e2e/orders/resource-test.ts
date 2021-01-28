import Arlula from "../../dist/index";

export default function runOrderResourceTests(client: Arlula): Promise<unknown> {

    return Promise.all([test1(client), test2(client)]);

}

// order get => child resource => download
function test1(client: Arlula) {
    return client.orders().get("1e71e2ff-507b-4fde-accc-f31bc6136afc")
    .then((order) => {
        if (!order.resources.length) {
            console.error("resource 1, Get order returned no resources");
            return Promise.reject("Get order returned no resources");
        }

        order.resources.forEach((resource) => {
            if (resource.type.startsWith("meta_")) {
                resource.download()
                .then((data) => {
                    if (!(data instanceof ArrayBuffer || data instanceof Buffer)) {
                        console.error("resource 1, unexpected resource data type: ", arrayBufferToString(data));
                        return Promise.reject(data);
                    }
                })
                .catch((e) => {
                    if (e instanceof ArrayBuffer || e instanceof Buffer) {
                        console.error("resource 1, unexpected error getting resource: ", arrayBufferToString(e));
                    } else {
                        console.error("resource 1, unexpected error getting resource: ", e);
                    }
                    return Promise.reject(e);
                });
            }
        })
    });
}

// client => resource download
function test2(client: Arlula) {
    return client.orders().downloadResource("d1c7e039-d394-4c92-af70-5f05f4f85f86")
    .then((data) => {
        if (!(data instanceof ArrayBuffer || data instanceof Buffer)) {
            console.error("resource 2, unexpected resource data type: ", arrayBufferToString(data));
            return Promise.reject(data);
        }
    })
    .catch((e) => {
        if (e instanceof ArrayBuffer || e instanceof Buffer) {
            console.error("resource 2, unexpected error getting resource: ", arrayBufferToString(e));
        } else {
            console.error("resource 2, unexpected error getting resource: ", e);
        }
        return Promise.reject(e);
    });
}

function arrayBufferToString(buf: ArrayBuffer): string {
    // std lib typings enforce an argument of 'number[]' and dont handle
    // the newer numeric array types like Uint8Array 
    // as a result this converts to unknown then to number array for type purposes
    return String.fromCharCode.apply(null, new Uint8Array (buf) as unknown as number[]);
}
