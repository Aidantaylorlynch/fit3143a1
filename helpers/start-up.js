export const getRunningPort = (argv) => {
    return argv[2]
}

export const getNeighbours = (argv) => {
    return argv.slice(4).map(neighbour => parseInt(neighbour))
}

export const getTokenHereValue = (argv) => {
    return argv[3] == 'true' ? true : false
}