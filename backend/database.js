let calls = [];

async function connectDatabase() {
console.log('Using in-memory storage');
}

async function saveCall(call) {
calls.push(call);
return call;
}

async function updateCall(callId, updates) {
const index = calls.findIndex(c => c.id === callId);
if (index !== -1) {
    calls[index] = { ...calls[index], ...updates };
}
return calls[index];
}

async function getAllCalls(filter = {}) {
if (Object.keys(filter).length === 0) return calls;
return calls.filter(call => {
    return Object.keys(filter).every(key => call[key] === filter[key]);
});
}

module.exports = {
connectDatabase,
saveCall,
updateCall,
getAllCalls
};