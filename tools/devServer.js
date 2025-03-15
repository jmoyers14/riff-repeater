import chalk from "chalk";
import chokidar from "chokidar";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "node:util";
import { WebSocketServer } from "ws";

const DEBOUNCE_DELAY = 100;
const WEBSOCKET_SERVER_PORT = 8420;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distPath = path.join(projectRoot, "dist");

let debounceTimeout = null;

const wss = new WebSocketServer({ port: WEBSOCKET_SERVER_PORT });

wss.on("listening", () => {
    const { port } = wss.address();
    const listeningMessage = chalk.blue("WebSocket server listening on");
    const address = chalk.white(`ws://localhost:${port}`);
    console.log(`\n${listeningMessage} ${address}\n`);
});

wss.on("connection", (socket) => {
    console.log("Client connected!");
});

const watcher = chokidar.watch(distPath, {
    ignored: [],
    persistent: true,
});

const sendReload = async () => {
    if (wss.clients.size === 0) {
        console.log(chalk.blue("No clients listening.\n"));
        return;
    }

    const sends = [];
    for (const client of wss.clients) {
        if (client.readyState === 1) {
            const send = promisify(send);
            sends.push(send("reload"));
        }
    }
    await Promise.allSettled(sends);
    console.log(
        chalk.blue(
            `Sent reload to ${sends.length}/${wss.clients.size} clients\n`
        )
    );
};

watcher.on("change", (filePath) => {
    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
    }
    console.log(`File ${filePath} has been changed`);

    debounceTimeout = setTimeout(sendReload, DEBOUNCE_DELAY);
});

// Clean up on exit
process.on("SIGINT", () => {
    wss.close();
    process.exit();
});
