const path = require("path");

const baseConfig = {
    entry: {
        index: "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
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
        }]
    }
};

module.exports =  [
    {...baseConfig},
    {
        ...baseConfig,
        mode: "production",
        output: {
            filename: "[name].min.js"
        }
    },
    {
        ...baseConfig,
        target: "node",
        entry: {index: "./e2e/index.ts"},
        output: {path: path.resolve(__dirname, "e2e/dist"),}
    }
];