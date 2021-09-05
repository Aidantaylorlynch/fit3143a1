import fs from 'fs'

export const enterCriticalSection = (port) => {
    const DbConnectionString = 'database/database.json'
    const raw = fs.readFileSync(DbConnectionString)
    let db = JSON.parse(raw)
    db.lastProcess = port
    db.lastUpdated = new Date().getTime()
    fs.writeFileSync(DbConnectionString, JSON.stringify(db))
}