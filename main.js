import express from 'express'

import { getRunningPort, getNeighbours, getTokenHereValue } from './helpers/start-up.js'
import { broadcastTokenRequest } from './helpers/broadcast.js'
import { receiveToken, receiveTokenRequest } from './helpers/receive.js'
import { initialisePendingRequests, updatePendingRequests  } from './helpers/requests.js'
import { enterCriticalSection } from './helpers/critical.js'

const app = express()
const port = getRunningPort(process.argv)
const neighbours = getNeighbours(process.argv)
let pendingRequests = initialisePendingRequests(neighbours)
let tokenHere = getTokenHereValue(process.argv)
let inCriticalSection = false

console.log(`
    port: ${port}
    neighbours: ${neighbours}
    pending: ${JSON.stringify(pendingRequests)}
    tokenHere: ${tokenHere}
`)

app.use(express.json())

app.get('/enter-critical-section', async (req, res) => {
    if (tokenHere)
    {
        console.log(`
            process already owns the token: entering critical section
        `)
        enterCriticalSection(port)
    }
    else
    {
        await broadcastTokenRequest(port, neighbours)
    }
    res.sendStatus(200)
})

app.post('/receive-token-request', async (req, res) => {
    const message = {
        ...req.body
    }
    console.log(`
        received token request from ${message.info.sender}
    `)
    pendingRequests = updatePendingRequests(pendingRequests, message)
    console.log(`
        updated pending requests: ${JSON.stringify(pendingRequests)}
    `)
    tokenHere = await receiveTokenRequest(message, port, neighbours, pendingRequests, tokenHere, inCriticalSection)
    res.sendStatus(200)
})

app.post('/receive-token', async (req, res) => {
    tokenHere = true
    const message = {
        ...req.body
    }
    tokenHere = await receiveToken(message, port, pendingRequests, tokenHere)
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`process has started on: ${port}`)
})