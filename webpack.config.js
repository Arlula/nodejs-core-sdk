const path = require("path");

const baseConfig = {
    entry: {
        index: "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
    },
    mode: "development",
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    devtool: "source-map",
    plugins: [],
};

const tsModule = {
    test: /\.tsx?$/,
    loader: "ts-loader",
    exclude: /node_modules/,
    
};

module.exports =  [
    {
        ...baseConfig,
        output: {
            filename: "browser.js"
        },
        module: {
            rules: [tsModule]
        }
    },
    {
        ...baseConfig,
        target: "node",
        output: {
            filename: "node.js"
        },
        module: {
            rules: [tsModule]
        }
    },
    {
        ...baseConfig,
        entry: {index: "./e2e/index.ts"},
        output: {
            path: path.resolve(__dirname, "e2e/dist"),
            filename: "browser.js"
        },
        module: {
            rules: [{
                ...tsModule,
                options: {
                    configFile: "tests.tsconfig.json"
                }
            }]
        }
    },
    {
        ...baseConfig,
        target: "node",
        entry: {index: "./e2e/index.ts"},
        output: {
            path: path.resolve(__dirname, "e2e/dist"),
            filename: "node.js"
        },
        module: {
            rules: [{
                ...tsModule,
                options: {
                    configFile: "tests.tsconfig.json"
                }
            }]
        }
    }
];