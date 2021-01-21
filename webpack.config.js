const path = require("path");
const { env } = require("process");

const baseConfig = {
    entry: {
        index: "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, "build"),
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

const modules = [
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
    }
];

const testModules = [
    {
        ...baseConfig,
        entry: {index: "./e2e/index.ts"},
        output: {
            path: path.resolve(__dirname, "e2e/build"),
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
            path: path.resolve(__dirname, "e2e/build"),
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

module.exports = env => {
    if (env.tests) {
        modules.push(...testModules);
    }

    return modules
}