const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "examples/src/index.html"),
    filename: "./index.html"
});
module.exports = {
    entry: "./examples/src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "examples/dist"),
        publicPath: '/'
    },
    devServer: {
        historyApiFallback: true,
        port: 3001
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [htmlWebpackPlugin],
    resolve: {
        extensions: [".js", ".jsx"]
    }
};