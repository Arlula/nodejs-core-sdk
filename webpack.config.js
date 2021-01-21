const path = require("path");

const baseConfig = {
    entry: {
        index: "./e2e/index.ts",
    },
    output: {
        path: path.resolve(__dirname, "e2e/dist"),
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
            exclude: /node_modules/,
            options: {
                configFile: "tests.tsconfig.json"
            }
        }]
    }
};

const outPath = path.resolve(__dirname, "e2e/build");

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
            path: ourPath,
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