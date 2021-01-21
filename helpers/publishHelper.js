const fs = require('fs');

// DO NOT DELETE THIS FILE
// This file is used by build system to build a clean npm package with the compiled js files in the root of the package.
// It will not be included in the npm package.

function main() {
    const source = fs.readFileSync("./package.json").toString('utf-8');
    const sourceObj = JSON.parse(source);
    sourceObj.scripts = {};
    sourceObj.devDependencies = {};
    if (sourceObj.main.startsWith("dist/")) {
        sourceObj.main = sourceObj.main.slice(5);
    }
    fs.writeFileSync("./dist/package.json", Buffer.from(JSON.stringify(sourceObj, null, 2), "utf-8") );

    // uncomment if ignore file required in future
    // fs.copyFileSync("./.npmignore", "./dist/.npmignore");

    fs.copyFileSync("./README.md", "./dist/README.md");
    fs.copyFileSync("./CONTRIBUTING.md", "./dist/CONTRIBUTING.md");
    fs.copyFileSync("./CHANGELOG.md", "./dist/CHANGELOG.md");
    fs.copyFileSync("./LICENSE", "./dist/LICENSE");
}

main();