const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const file = path.join(__dirname, 'db.json');
const adapter = new FileSync(file);
const db = low(adapter);

// Set default data
db.defaults({ users: [], sellers: [], products: [] }).write();

module.exports = {
  read: async () => {
    // lowdb v1 with FileSync is synchronous, but we keep it async for compatibility
    return db.read();
  },
  write: async () => {
    return db.write();
  },
  get data() {
    return db.getState();
  }
};