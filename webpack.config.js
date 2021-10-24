const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const HTML_DIR = "html";
const JS_DIR = "js";

const webpackConfig = {
	entry: {},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name]",
	},
	plugins: [],
	optimization: {
		splitChunks: {
			name: "vendor.js",
			chunks: "initial",
		},
	},
	devServer: {
		host: "0.0.0.0",
		open: true,
		hot: true,
	},
};

glob.sync("*.js", {cwd: "src/js"}).forEach((jsName) => {
	webpackConfig.entry[jsName] = path.resolve("src", JS_DIR, jsName);
	const dirName = path.basename(jsName, ".js");
	const tplName = path.basename(jsName, ".js") + ".html";
	webpackConfig.plugins.push(
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src", HTML_DIR, tplName),
			filename: dirName === "index" ? "index.html" : dirName + "/index.html",
			inject: "body",
			includeSiblingChunks: true,
			chunks: ["vendor.js", jsName],
		})
	);
});

module.exports = webpackConfig;
