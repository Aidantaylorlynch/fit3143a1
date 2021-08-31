export const initialisePendingRequests = (neighbours) => {
    let pendingRequests = {}
    for (let counter = 0; counter < neighbours.length; counter ++)
    {
        const key = neighbours[counter]
        pendingRequests[key] = -1
    }
    return pendingRequests
}

export const updatePendingRequests = (pendingRequests, message) => {
    pendingRequests[message.info.sender] = message.id
    // search pending requests for other requests from the same origin - delete them because they are old
    return pendingRequests
}