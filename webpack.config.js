const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "examples/src/index.html"),
    filename: "index.html"
});

module.exports = (env, argv) => {
    const PUBLIC_URL = argv.mode === 'development'
        ? '/'
        : '/react-location'; //because of gh-pages

    return {
        entry: "./examples/src/index.js",
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "examples/dist"),
            publicPath: PUBLIC_URL
        },
        devServer: {
            historyApiFallback: true,
            port: 3001,
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
        plugins: [
            htmlWebpackPlugin,
            new webpack.DefinePlugin({
                'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL)
            })
        ],
        resolve: {
            extensions: [".js", ".jsx"]
        }
    }
};