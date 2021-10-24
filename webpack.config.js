const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const HTML_DIR = "html";
const JS_DIR = "js";

const webpackConfig = {
	entry: {},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name]",
		assetModuleFilename: "images/[hash][ext][query]",
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "style.css",
		}),
	],
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
	resolve: {
		roots: [path.resolve(__dirname, "src")],
		alias: {
			"~": path.resolve(__dirname, "src"),
		},
	},
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: "html-loader",
			},
			// Sassファイルの読み込みとコンパイル
			{
				test: /\.(sa|sc|c)ss$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {url: true}, // trueに変更
					},
					"sass-loader",
				],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
		],
	},
};

glob.sync("*.js", {cwd: "src/js"}).forEach((jsName) => {
	const dirName = path.basename(jsName, ".js");
	const tplName = path.basename(jsName, ".js") + ".html";
	webpackConfig.entry[dirName === "index" ? jsName : dirName + "/index.js"] =
		path.resolve("src", JS_DIR, jsName);
	webpackConfig.plugins.push(
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src", HTML_DIR, tplName),
			filename: dirName === "index" ? "index.html" : dirName + "/index.html",
			inject: "body",
			includeSiblingChunks: true,
			chunks: [
				"vendor.js",
				dirName === "index" ? "index.js" : dirName + "/index.js",
			],
		})
	);
});

module.exports = webpackConfig;
