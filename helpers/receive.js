import { forwardToken, propagateTokenRequest, transmitToken } from "./broadcast.js"
import { enterCriticalSection } from "./critical.js"
import { updateSender } from "./messages.js"

export const receiveTokenRequest = async (message, port, neighbours, pendingRequests, tokenHere, inCriticalSection) => {
    const updatedSender = updateSender(port, message)
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
        console.log(`
            token received: ${JSON.stringify(message)}
            entering critical section
        `)
        enterCriticalSection(port)
        return tokenHere
    }
    else
    {
        forwardToken(port, pendingRequests, message)
        return !tokenHere
    }
}