import net from "node:net";
import chalk from "chalk"
import { runCommand } from "./helpers.js";
import { stdout } from "node:process";

const [, , portArg] = process.argv;

if (!portArg) {
    console.log("Usage: node nc-server.js <port>");
    process.exit(1);
}

function keyOf(socket) {
    return "Address:" + socket.remoteAddress + " Port:" + socket.remotePort
}

function serverLog({ command, socket, stdout, stderr }) {

    if (stderr) {
        socket.write(stderr)
    }

    console.log("-----------------------------")
    console.log("From: " + keyOf(socket))
    console.log(chalk.bold("Command: " + command))

    console.log(chalk.cyan("Stdout: "))
    console.log(chalk.cyan("-----------------------------"))
    console.log(chalk.yellow(stdout))
    console.log(chalk.cyan("-----------------------------"))

    console.log(chalk.red("Stderr: "))
    console.log(chalk.red("-----------------------------"))
    console.log(stderr || "No Errors")
    console.log(chalk.red("-----------------------------"))
    console.log("-----------------------------")
}


const sessions = {}
const port = Number(portArg);


const builtInCommands = {
    "session": (socket) => {
        const stdout = keyOf(socket) + "\n"
        socket.write(stdout)
        return { stdout }
    },
    "history": (socket) => {
        const stdout = JSON.stringify(sessions[keyOf(socket)].history) + "\n"
        socket.write(stdout)
        return { stdout }
    },
    "exit": (socket) => {
        delete sessions[keyOf(socket)];
        socket.write("Goodbye !")
        socket.end()
        return { stdout: "Session closed from " + keyOf(socket) }
    },
    "help": async (socket) => {
        const { stdout, stderr } = await runCommand("cat ./help.txt")
        socket.write(stdout)
        return { stdout, stderr }
    },
    "info": async (socket) => {
        const { stdout, stderr } = await runCommand("cat ./info.txt")
        socket.write(chalk.cyan(stdout))
        return { stdout, stderr }
    },
    "author": (socket) => {
        const stdout = "https://github.com/hrach347"
        socket.write(stdout)
        return { stdout }
    },
    "users": async (socket) => {
        const stdout = JSON.stringify(Object.keys(sessions))
        socket.write(stdout)
        return { stdout }
    },
    "broadcast": async (socket, options) => {
        options.shift()
        const message = "From - " + keyOf(socket) + " \n" + options.join(" ") + "\n"
        for (let session in sessions) {
            sessions[session].socket.write(chalk.bgRedBright(message))
        }
        return { stdout: "Broadcasted to all active sessions" }
    },
    "clearhistory": (socket) => {
        sessions[keyOf(socket)].history = []
        socket.write("Cleared!")
        return { stdout: "Cleared!" }
    }
}


const server = net.createServer((socket) => {
    console.log("Client Connected from: " + keyOf(socket));
    sessions[keyOf(socket)] = { socket }
    sessions[keyOf(socket)].history = []

    socket.on("data", async data => {
        const command = data.toString().trim()

        if (!command) {
            socket.write("\n")
            return null
        }

        sessions[keyOf(socket)].history.push(command)

        if (builtInCommands[command.split(" ")[0]]) {
            const { stdout, stderr } = await builtInCommands[command.split(" ")[0]](socket, command.split(" "))
            serverLog({ command, socket, stdout, stderr })
            return null
        }

        const { stdout, stderr } = await runCommand(command)
        socket.write(stdout || " ")
        serverLog({ command, socket, stdout, stderr })
    });

    socket.on("end", () => {
        console.log("\nclient disconnected");
    });

    socket.on("error", (err) => {
        console.error("socket error:", err.message);
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});