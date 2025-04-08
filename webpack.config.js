import path from "path";
import { fileURLToPath } from "url";
import CopyPlugin from "copy-webpack-plugin";
import { options } from "preact";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        background: "./src/background.ts",
        content: "./src/content.tsx",
        popup: "./src/popup/popup.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        onlyCompileBundledFiles: true,
                    },
                },
                exclude: [/node_modules/, /__tests__/],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg$/,
                type: "asset/resource",
                generator: {
                    filename: "assets/[name][ext]",
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/manifest.json", to: "." },
                { from: "src/popup/popup.html", to: "." },
                { from: "src/styles.css", to: "." },
            ],
        }),
    ],
};
