export const createTokenRequestMessage = (origin) => {
    return {
        id: {
            origin,
            time: new Date().getTime()
        },
        info: {
            sender: origin,
            seen: []
        }
    }
}

export const createTokenMessage = (port, tokenRequestMessage) => {
    const tokenMessage = {
        elected: tokenRequestMessage.id.origin,
        lud: {}
    }
    tokenMessage.lud[port] = new Date().getTime()
    return tokenMessage
}

export const markAsSeen = (neighbours, message) => {
    const updatedMessage = {
        ...message
    }
    // only add neighbours to seen if they are do not already exist
    neighbours.forEach((neighbour) => {
        if (updatedMessage.info.seen.includes(neighbour) === false)
        {
            updatedMessage.info.seen.push(neighbour)
        }
    })
    return updatedMessage
}

export const updateSender = (port, message) => {
    const updatedMessage = {
        ...message,
        info: {
            ...message.info,
            sender: port
        }
    }
    return updatedMessage
}

export const updateLud = (port, message) => {
    const updatedMessage = {
        ...message
    }
    updatedMessage.lud[port] = new Date().getTime()
    return updatedMessage
}

export const findNewTargets = (neighbours, message) => {
    return neighbours.filter((neighbour) => {
        if (message.info.seen.includes(neighbour) || message.id.origin == neighbour)
        {
            return false
        }
        else
        {
            return true
        }
    })
}