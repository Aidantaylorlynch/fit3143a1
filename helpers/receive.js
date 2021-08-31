import { forwardToken, propagateTokenRequest, transmitToken } from "./broadcast.js"
import { updateSender } from "./messages.js"

export const receiveTokenRequest = async (message, port, neighbours, pendingRequests, tokenHere, inCriticalSection) => {
    const updatedSender = updateSender(port, message)
    console.log(`
        updated sender: ${JSON.stringify(updatedSender)}
    `)
    propagateTokenRequest(updatedSender, neighbours)
    if (tokenHere && inCriticalSection === false)
    {
        transmitToken(port, pendingRequests, message)
        return !tokenHere
    }
    else
    {
        return tokenHere
    }
}

export const receiveToken = async (message, port, pendingRequests, tokenHere) => {
    if (message.elected == port)
    {
        // enter critical section
        console.log(`
            token request serviced: entering critical section
        `)
        return tokenHere
    }
    else
    {
        forwardToken(port, pendingRequests, message)
        return !tokenHere
    }
}