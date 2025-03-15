import { spawn } from "child_process";
import chalk from "chalk";

// Start TypeScript compiler in watch mode
const tsc = spawn("npx", ["tsc", "--watch", "--preserveWatchOutput"], {
    stdio: ["inherit", "ignore", "inherit"], // Only show TypeScript errors
});

// Start dev server
const server = spawn("node", ["tools/devServer.js"], {
    stdio: "inherit", // Show all server output
});

// Handle process cleanup
const cleanup = () => {
    tsc.kill();
    server.kill();
    process.exit();
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Handle child process errors
tsc.on("error", (error) => {
    console.error(chalk.red("Failed to start TypeScript compiler:"), error);
    cleanup();
});

server.on("error", (error) => {
    console.error(chalk.red("Failed to start dev server:"), error);
    cleanup();
});
