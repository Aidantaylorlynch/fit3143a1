import express from 'express'

import { getRunningPort, getNeighbours, getTokenHereValue } from './helpers/start-up.js'
import { broadcastTokenRequest } from './helpers/broadcast.js'
import { receiveToken, receiveTokenRequest } from './helpers/receive.js'
import { initialisePendingRequests, updatePendingRequests  } from './helpers/requests.js'

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
    pendingRequests = updatePendingRequests(pendingRequests, message)
    console.log(`
        updated pending: ${JSON.stringify(pendingRequests)}
    `)
    tokenHere = await receiveTokenRequest(message, port, neighbours, pendingRequests, tokenHere, inCriticalSection)
    console.log(`
        updated tokenHere: ${tokenHere}
    `)
    res.sendStatus(200)
})

app.post('/receive-token', async (req, res) => {
    tokenHere = true
    const message = {
        ...req.body
    }
    console.log(`
        token received: ${JSON.stringify(message)}
    `)
    tokenHere = await receiveToken(message, port, pendingRequests, tokenHere)
    console.log(`
        updated tokenHere: ${tokenHere}
    `)
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`process has started on: ${port}`)
})