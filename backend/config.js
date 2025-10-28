require('dotenv').config();
module.exports = {
port: process.env.PORT || 3001,
vapi: {
    apiKey: process.env.VAPI_API_KEY,
    phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
    assistantId: process.env.VAPI_ASSISTANT_ID
},
twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
},
mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vanessa'
},
acquisitionsLead: {
    phone: process.env.ACQUISITIONS_LEAD_PHONE,
    transferEnabled: true
}
};