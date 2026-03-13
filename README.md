# Remote Shell 🐚
![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![TCP](https://img.shields.io/badge/network-TCP-orange)
![Status](https://img.shields.io/badge/status-active-success)

Node.js TCP remote shell which allows multiple clients to connect and execute commands on a server. It mimics basic Netcat-style behavior with built-in commands.

## Usage Preview
![Demo](Images/Screenshot%20From%202026-03-13%2015-23-49.png)
![Demo](Images/Screenshot%20From%202026-03-13%2015-24-54.png)
![Demo](Images/Screenshot%20From%202026-03-13%2015-25-11.png)

## Clone the repo
```bash
git clone https://github.com/hrach347/remote-shell.git
cd remote-shell
```
## Install the dependencies and Run
```bash
npm install
node server.js 4444
node client.js 127.0.0.1 4444
```

## Features

- Multi-session TCP server
- Remote command execution
- Built-in commands
- Command history per session
- Interactive client interface
- Netcat-style behavior

## This project was built to explore

- TCP networking in Node.js
- Building interactive CLI tools
- Session management
- Remote command execution


## License
MIT
