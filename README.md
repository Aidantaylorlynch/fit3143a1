# Proof of concept - distributed algorithm for mutual exlcusion using expressjs

## Overview
- Processes will be represented by a single **expressjs** server
- Processes can be uniquely identified by the port number on which the server is running, for example: ```http://localhost:8001``` will have the id of **8001**
- Processes can communicate with each other via **HTTP** network requests, as each process will expose an **API** to facilitate **message passing**.
- Network **topology** will be ```1--2--3--4--5--6--7--8```
    - Process **1** can communicate with only process **2**.
    - Process **2** can communicate with only **1** and **3**.
    - etc

## Requirements
- [nodejs LTS](https://nodejs.org/en/download/)

## Install
- In order to install project dependencies, open a terminal in the root directory of this project and run
```bash
$npm install
```

## Running
- In order to run this project, open a terminal in the root directory of this project and run
```bash
node ./main.js <port> <tokenHere> <neighbour-1> <neighbour-2>...<neighbour-n>
```
- ```<port>: number``` - the port number the express server will run on
- ```<tokenHere>: boolean``` - initialise the process as the owner of a token. (This should only be initialised on a single process)
- ```<neighbour-n>: number``` - a space seperated list of neighbouring processes

## Triggering process communication
- In order to trigger a process to enter the critical section, a **GET** request should be made to ```http://localhost:<process-id>/enter-critical-section```
- This will trigger the process to broadcast a request message to all neighbours for a token