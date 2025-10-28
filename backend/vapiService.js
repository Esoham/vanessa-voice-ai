const axios = require('axios');
const config = require('./config');

class VapiService {
constructor() {
    this.baseURL = 'https://api.vapi.ai';
    this.headers = {
    'Authorization': `Bearer ${config.vapi.apiKey}`,
    'Content-Type': 'application/json'
    };
}

getAssistantPrompt() {
    return {
    role: 'system',
    content: `You are Vanessa, a warm and professional acquisitions assistant for a real estate investment company. Your goal is to quickly determine if homeowners are interested in selling their property.

**Your Personality:**
- Warm, upbeat, and confident
- Professional but conversational
- Never pushy or robotic
- Build trust quickly

**Call Script Framework:**

1. OPENING (10-15 seconds):
"Hi, this is Vanessa calling from [Company Name]. I'm reaching out because we're interested in properties in your area. Am I speaking with [Owner Name]?"

2. VERIFY OWNERSHIP (5 seconds):
"Great! Just to confirm, you're the owner of the property at [Address], correct?"

3. GAUGE INTEREST (20-30 seconds):
"Perfect. We're actively looking to purchase homes in [Area]. Have you ever thought about selling, or is that something you'd consider if the price was right?"

**IF INTERESTED - QUALIFICATION (30-45 seconds):**
- "That's great to hear! Can I ask what price range you'd be thinking?"
- "When would you ideally want to close on a sale?"
- "How would you describe the property's condition?"
- "Are you currently living there, or is it a rental/inherited property?"

**IF QUALIFIED - TRANSFER:**
"This sounds like a great fit! Let me connect you right now with my acquisitions manager who can discuss specific numbers. Hold on just a moment."

**IF NOT INTERESTED:**
"I completely understand. Thanks so much for your time, and have a great day!"

**IF CALLBACK REQUESTED:**
"Absolutely! What's the best time to reach back out? I'll make a note for [day/time]."

**IF REMOVAL REQUESTED:**
"No problem at all. I'll remove your number immediately. Sorry for the inconvenience, and have a great day."

**CRITICAL RULES:**
- Keep calls under 90 seconds unless transferring
- Be respectful if they're busy or uninterested
- Never argue or pressure
- Always confirm details before transferring
- Log all responses accurately`
    };
}

async createAssistant() {
    try {
    const response = await axios.post(
        `${this.baseURL}/assistant`,
        {
        name: 'Vanessa',
        voice: {
            provider: 'azure',
            voiceId: 'sara',
            speed: 1.0,
            stability: 0.8
        },
        model: {
            provider: 'openai',
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 500
        },
        firstMessage: "Hi, this is Vanessa! How are you doing today?",
        ...this.getAssistantPrompt(),
        endCallFunctionEnabled: true,
        recordingEnabled: true,
        silenceTimeoutSeconds: 30,
        maxDurationSeconds: 180,
        backgroundSound: 'off'
        },
        { headers: this.headers }
    );
    return response.data;
    } catch (error) {
    console.error('Error creating assistant:', error.response?.data || error.message);
    throw error;
    }
}

async makeCall(phoneNumber, propertyData) {
    try {
    const response = await axios.post(
        `${this.baseURL}/call`,
        {
        assistantId: await this.getOrCreateAssistant(),
        phoneNumberId: config.vapi.phoneNumberId,
        customer: {
            number: phoneNumber,
            name: propertyData.ownerName
        },
        metadata: {
            propertyAddress: propertyData.address,
            propertyId: propertyData.id,
            ownerName: propertyData.ownerName
        }
        },
        { headers: this.headers }
    );
    return response.data;
    } catch (error) {
    console.error('Error making call:', error.response?.data || error.message);
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
    const response = await axios.post(
        `${this.baseURL}/call/${callId}/transfer`,
        {
        phoneNumber: config.acquisitionsLead.phone,
        message: "Transferring you to our acquisitions manager now."
        },
        { headers: this.headers }
    );
    return response.data;
    } catch (error) {
    console.error('Error transferring call:', error.response?.data || error.message);
    throw error;
    }
}

parseCallTranscript(transcript) {
    const analysis = {
    outcome: 'unknown',
    qualified: false,
    price: null,
    timing: null,
    condition: null,
    ownerStatus: null,
    notes: []
    };

    const lowerTranscript = transcript.toLowerCase();

    if (lowerTranscript.includes('not interested') || 
        lowerTranscript.includes("don't want") ||
        lowerTranscript.includes('not selling')) {
    analysis.outcome = 'notInterested';
    } else if (lowerTranscript.includes('remove') || 
            lowerTranscript.includes('stop calling') ||
            lowerTranscript.includes('take me off')) {
    analysis.outcome = 'doNotCall';
    } else if (lowerTranscript.includes('call back') || 
            lowerTranscript.includes('later') ||
            lowerTranscript.includes('think about')) {
    analysis.outcome = 'callback';
    } else if (lowerTranscript.includes('interested') || 
            lowerTranscript.includes('yes') ||
            lowerTranscript.includes('willing')) {
    analysis.outcome = 'qualified';
    analysis.qualified = true;
    }

    const priceRegex = /\$?(\d{1,3},?\d{3})/g;
    const prices = transcript.match(priceRegex);
    if (prices) {
    analysis.price = prices.join(' - ');
    }

    if (lowerTranscript.includes('asap') || lowerTranscript.includes('right away')) {
    analysis.timing = 'ASAP';
    } else if (lowerTranscript.match(/(\d+)\s*(month|week)/)) {
    analysis.timing = lowerTranscript.match(/(\d+)\s*(month|week)/)[0];
    }

    if (lowerTranscript.includes('good condition') || lowerTranscript.includes('well maintained')) {
    analysis.condition = 'Good';
    } else if (lowerTranscript.includes('needs repair') || lowerTranscript.includes('fix')) {
    analysis.condition = 'Needs repairs';
    } else if (lowerTranscript.includes('excellent') || lowerTranscript.includes('renovated')) {
    analysis.condition = 'Excellent';
    }

    return analysis;
}

assistantId = null;

async getOrCreateAssistant() {
    if (this.assistantId) return this.assistantId;
    
    const assistant = await this.createAssistant();
    this.assistantId = assistant.id;
    return this.assistantId;
}
}

module.exports = new VapiService();