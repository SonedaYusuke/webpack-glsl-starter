const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/js/index.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src", "html", "index.html"),
			filename: "index.html",
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src", "html", "about.html"),
			filename: "about.html",
		}),
	],
};
