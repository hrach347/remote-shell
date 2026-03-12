import net from "node:net";
import chalk from "chalk";
import readline from "node:readline";

const [, , host, portArg] = process.argv;

if (!host || !portArg) {
    console.log("Usage: node client.js <host> <port>");
    process.exit(1);
}

const port = Number(portArg);
const socket = net.createConnection({ host, port });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.bgCyan('root@root:netcat$')
});

socket.on("connect", () => {
    console.log(`Connected to ${host}:${port}`);
    console.log("Run 'help' command for help")
    console.log(chalk.greenBright("-----------------------------------------"))
    rl.prompt()
});

rl.on("line", line => {
    socket.write(line + "\n");
});

socket.on("data", data => {
    const response = data.toString().trim()
    console.log(chalk.greenBright("-----------------------------------------"))
    console.log(chalk.bold(response))
    console.log(chalk.greenBright("-----------------------------------------"))
    rl.prompt()
})

socket.on("error", (err) => {
    console.error("connection error:", err.message);
    process.exit(1);
});

socket.on("close", () => {
    process.exit();
});