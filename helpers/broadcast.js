import axios from 'axios'

import { createTokenMessage, createTokenRequestMessage, findNewTargets, markAsSeen, updateLud } from './messages.js'

export const broadcastTokenRequest = async (port, neighbours) => {
    const message = createTokenRequestMessage(port)
    const updatedMessage = markAsSeen(neighbours, message)
    const broadcasts = neighbours.map((neighbour) => {
        const url = `http://localhost:${neighbour}/receive-token-request`
        console.log(`
            url: ${url}
        `)
        return axios.post(url, updatedMessage)
    })
    await Promise.all(broadcasts)
}

export const propagateTokenRequest = async (message, neighbours) => {
    const targets = findNewTargets(neighbours, message)
    const updatedMessage = markAsSeen(targets, message)
    console.log(`
        updated seen: ${JSON.stringify(updatedMessage)}
    `)
    const broadcasts = targets.map((target) => {
        const url = `http://localhost:${target}/receive-token-request`
        console.log(`
            url: ${url}
        `)
        return axios.post(url, updatedMessage)
    })
    await Promise.all(broadcasts)
}

export const transmitToken = async (port, pendingRequests, message) => {
    const tokenMessage = createTokenMessage(port, message)
    const target = getTarget(pendingRequests, tokenMessage)
    const url = `http://localhost:${target}/receive-token`
    console.log(`
        forwarding token to: ${tokenMessage.elected} via: ${url}
    `)
    await axios.post(url, tokenMessage)
}

export const forwardToken = async (port, pendingRequests, message) => {
    const updatedTokenMessage = updateLud(port, message)
    const target = getTarget(pendingRequests, updatedTokenMessage)
    const url = `http://localhost:${target}/receive-token`
    console.log(`
        forwarding token to: ${updatedTokenMessage.elected} via: ${url}
    `)
    await axios.post(url, updatedTokenMessage)
}

// iterate through pending requests and find value whos id == token.elected
const getTarget = (pendingRequests, message) => {
    const target = Object.keys(pendingRequests).filter((key) => {
        return pendingRequests[key].origin == message.elected
    })[0]
    // delete old request now as it is getting serviced
    console.log(`
        transmission target: ${target}
    `)
    return target
}