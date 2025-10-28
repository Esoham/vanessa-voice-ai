const axios = require('axios');
const config = require('./config');

class RealCallService {
constructor() {
    this.baseURL = 'https://api.vapi.ai';
    this.headers = {
    'Authorization': `Bearer ${config.vapi.apiKey}`,
    'Content-Type': 'application/json'
    };
}

async makeOutboundCall(phoneNumber, propertyData) {
    try {
    console.log('Calling ' + phoneNumber + ' for ' + propertyData.address);
    
    const response = await axios.post(
        `${this.baseURL}/call/phone`,
        {
        assistantId: config.vapi.assistantId,
        phoneNumberId: config.vapi.phoneNumberId,
        customer: {
            number: phoneNumber
        },
        assistantOverrides: {
            variableValues: {
            ownerName: propertyData.ownerName,
            address: propertyData.address
            },
            firstMessage: `Hi! This is Vanessa calling about your property at ${propertyData.address}. How are you doing today?`
        }
        },
        { headers: this.headers }
    );

    console.log('Call initiated successfully');
    console.log('Call ID:', response.data.id);
    
    return response.data;
    } catch (error) {
    console.error('Error making call:');
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Message:', error.message);
    throw error;
    }
}

async getCallStatus(callId) {
    try {
    const response = await axios.get(
        `${this.baseURL}/call/${callId}`,
        { headers: this.headers }
    );
    return response.data;
    } catch (error) {
    console.error('Error getting call status:', error.response?.data || error.message);
    throw error;
    }
}

async transferCall(callId) {
    try {
    console.log('Transferring call ' + callId);
    
    const response = await axios.post(
        `${this.baseURL}/call/${callId}/transfer`,
        {
        destinationNumber: config.acquisitionsLead.phone
        },
        { headers: this.headers }
    );

    console.log('Call transferred successfully');
    return response.data;
    } catch (error) {
    console.error('Error transferring call:', error.response?.data || error.message);
    throw error;
    }
}
}

module.exports = new RealCallService();