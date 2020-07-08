const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
function getDB(dbPath) {
    const adapter = new FileSync(dbPath);
    return low(adapter);
}

export { getDB };
