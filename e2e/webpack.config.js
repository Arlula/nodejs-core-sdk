const path = require("path");

const outPath = path.resolve(__dirname, "dist");

const baseConfig = {
    entry: {
        index: "./index.ts",
    },
    output: {
        path: outPath,
    },
    mode: "development",
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    devtool: "source-map",
    plugins: [],
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/
        }]
    }
};

const testModules = [
    {
        ...baseConfig,
        output: {
            path: outPath,
            filename: "browser.js"
        }
    },
    {
        ...baseConfig,
        target: "node",
        output: {
            path: outPath,
            filename: "node.js"
        }
    }
];

module.exports = env => {
    if (env.tests) {
        return testModules;
    }

    return [];
}