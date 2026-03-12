import { exec } from "node:child_process";

export function runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            resolve({ stdout, stderr });
        });
    });
}