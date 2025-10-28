const express = require('express');
const cors = require('cors');
const config = require('./config');
const realCallService = require('./realCallService');

const app = express();

app.use(cors());
app.use(express.json());

// Make REAL outbound call via Vapi
app.post('/api/calls/real', async (req, res) => {
try {
    const { phoneNumber, ownerName, address, propertyId } = req.body;
    
    console.log(` Initiating real call to ${phoneNumber}`);
    
    const call = await realCallService.makeOutboundCall(phoneNumber, {
    ownerName,
    address,
    id: propertyId
    });
    
    res.json({
    success: true,
    callId: call.id,
    status: call.status,
    message: 'Real call initiated successfully!'
    });
} catch (error) {
    console.error('Error making real call:', error);
    res.status(500).json({
    success: false,
    error: error.message
    });
}
});

// Get real call status
app.get('/api/calls/real/:callId', async (req, res) => {
try {
    const { callId } = req.params;
    const callData = await realCallService.getCallStatus(callId);
    
    res.json({
    success: true,
    call: callData
    });
} catch (error) {
    res.status(500).json({
    success: false,
    error: error.message
    });
}
});

app.get('/health', (req, res) => {
res.json({ status: 'ok', service: 'Vanessa Voice AI' });
});

const PORT = config.port;
app.listen(PORT, () => {
console.log(` Vanessa Voice AI Backend running on port ${PORT}`);
console.log(` Ready to make calls!`);
});