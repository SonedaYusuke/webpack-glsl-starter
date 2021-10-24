const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const HTML_DIR = "html";
const JS_DIR = "js";

const webpackConfig = {
	entry: {},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name]",
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
		alias: {
			"~": path.resolve(__dirname, "src"),
		},
	},
	module: {
		rules: [
			// Sassファイルの読み込みとコンパイル
			{
				test: /\.scss/, // 対象となるファイルの拡張子
				use: [
					// CSSファイルを抽出するように MiniCssExtractPlugin のローダーを指定
					{
						loader: MiniCssExtractPlugin.loader,
					},
					// CSSをバンドルするためのローダー
					{
						loader: "css-loader",
						options: {
							//URL の解決を無効に
							url: false,
							// ソースマップを有効に
							sourceMap: true,
						},
					},
					// Sass を CSS へ変換するローダー
					{
						loader: "sass-loader",
						options: {
							// dart-sass を優先
							implementation: require("sass"),
							// ソースマップを有効に
							sourceMap: true,
						},
					},
				],
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
