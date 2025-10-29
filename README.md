# Vanessa - Voice AI Acquisitions Agent

A functional voice AI agent that makes automated outbound calls to property owners, qualifies seller intent within 90 seconds, and transfers hot leads to human acquisitions managers.

## 🚀 Features

- 🤖 AI-powered voice conversations using GPT-4
- 📞 Real phone call integration via Vapi.ai
- ⚡ 90-second lead qualification
- 📊 Real-time dashboard for call tracking
- 🔄 Automatic call transfers for qualified leads
- 💬 Natural conversation handling (interested, callback, DNC)

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** React, Tailwind CSS
- **Voice AI:** Vapi.ai (Vonage integration)
- **AI Model:** OpenAI GPT-4

## ⚠️ Prerequisites

Before you can run this project, you need:

1. **Node.js v18+** - [Download here](https://nodejs.org)
2. **Vapi.ai Account** - [Sign up here](https://vapi.ai)
3. **Phone Number** - Import from Vonage/Twilio or get a free Vapi number
4. **API Credentials** - From Vapi Dashboard

### Getting Vapi Credentials

1. **API Key:**
   - Go to Vapi Dashboard → Settings → API Keys
   - Copy your Private Key

2. **Phone Number:**
   - Go to Phone Numbers → Buy/Import Number
   - Copy the Phone Number ID (UUID format)

3. **Assistant ID:**
   - Go to Assistants → Create New Assistant
   - Name: "Vanessa - Acquisitions Agent"
   - Model: GPT-4
   - Voice: Choose a warm female voice (e.g., Kylie)
   - System Prompt: See below
   - Copy the Assistant ID after creation

### Vanessa's System Prompt

Use this in your Vapi Assistant:
```
You are Vanessa, a warm and professional real estate acquisitions assistant.

YOUR GOAL: Quickly qualify if homeowner wants to sell their property within 90 seconds.

CONVERSATION FLOW:

1. GREETING (10 sec):
"Hi! This is Vanessa calling about your property at [address]. How are you today?"

2. VERIFY OWNERSHIP (5 sec):
"Just to confirm - you own the property at [address], correct?"

3. GAUGE INTEREST (20 sec):
"We're actively buying homes in your area. Have you thought about selling, or would you consider it if the price was right?"

IF INTERESTED - ASK:
- "What price range were you thinking?"
- "When would you want to close?"
- "How's the property's condition?"
- "Are you living there, or is it rented/inherited?"

IF QUALIFIED (mentions price + timeline):
"This sounds like a great fit! Let me connect you with my acquisitions manager right now."

IF NOT INTERESTED:
"I completely understand! Thanks for your time. Have a wonderful day!"

IF CALLBACK:
"Absolutely! What day and time works best?"

IF REMOVAL:
"No problem - I'll remove your number immediately. Sorry for the inconvenience!"

RULES:
- Stay under 90 seconds unless transferring
- Be warm and conversational, never pushy
- Listen actively
- Always be respectful
```

## 📦 Installation

### 1. Clone the repository:
```bash
git clone https://github.com/Esoham/vanessa-voice-ai.git
cd vanessa-voice-ai
```

### 2. Install backend dependencies:
```bash
cd backend
npm install
```

### 3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### 4. Create `.env` file:

Create a file named `.env` in the `backend/` folder:
```bash
cd backend
notepad .env  # Windows
# or
nano .env     # Mac/Linux
```

Add these variables with YOUR credentials:
```env
VAPI_API_KEY=your_vapi_private_key_here
VAPI_PHONE_NUMBER_ID=your_phone_number_id_here
VAPI_ASSISTANT_ID=your_assistant_id_here
ACQUISITIONS_LEAD_PHONE=+1234567890
PORT=3001
```

**Important:** Replace ALL placeholder values with your actual Vapi credentials!

## 🎯 Usage

### Start the Backend (Terminal 1):
```bash
cd backend
npm start
```

You should see:
```
Vanessa Voice AI Backend running on port 3001
Ready to make calls!
```

### Start the Frontend (Terminal 2):
```bash
cd frontend
npm start
```

Browser will open at `http://localhost:3000`

### Make a Real Voice Call:

Open a third terminal and run:
```bash
curl -X POST http://localhost:3001/api/calls/real \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "ownerName": "John Doe",
    "address": "123 Main St",
    "propertyId": "prop-001"
  }'
```

**The phone number will ring and Vanessa will speak!**

## 📂 Project Structure
```
vanessa-voice-ai/
├── backend/
│   ├── server.js              # Express API server
│   ├── realCallService.js     # Vapi.ai integration
│   ├── config.js              # Configuration loader
│   ├── database.js            # In-memory storage
│   ├── vapiService.js         # Additional Vapi utilities
│   ├── package.json           # Backend dependencies
│   └── .env                   # Environment variables (not in repo)
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main dashboard component
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Tailwind styles
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── package.json           # Frontend dependencies
│   └── tailwind.config.js     # Tailwind configuration
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🔌 API Endpoints

### POST `/api/calls/real`
Initiate an outbound call

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "ownerName": "John Doe",
  "address": "123 Main St",
  "propertyId": "prop-001"
}
```

**Response:**
```json
{
  "success": true,
  "callId": "019a280c-329d-7ccf-85ec-9f75ab61c4c0",
  "status": "queued",
  "message": "Real call initiated successfully!"
}
```

### GET `/api/calls/real/:callId`
Get call status and details

### GET `/api/calls`
Get call history

### POST `/api/calls/:callId/transfer`
Transfer call to acquisitions lead

## 🎭 How Vanessa Works

1. **Call Initiation** - Backend API triggers Vapi to make outbound call
2. **AI Conversation** - GPT-4 powered Vanessa speaks with property owner
3. **Intent Detection** - AI qualifies lead based on responses
4. **Decision Point:**
   - ✅ Qualified → Transfer to human agent
   - ⏰ Callback → Schedule follow-up
   - ❌ Not Interested → Polite exit
   - 🚫 DNC Request → Remove from list
5. **Dashboard Logging** - All outcomes tracked in real-time

## 🖥️ Dashboard Features

- **Active Call Panel** - Shows live call progress with real-time notes
- **Stats Overview** - Total calls, qualified leads, callbacks, DNC
- **Property Owners List** - Queue of contacts to call
- **Call History** - Complete log with outcomes and details
- **Transfer Button** - One-click transfer for qualified leads

## 🚨 Important Notes

- **Demo Project:** This is a prototype built for technical interviews
- **No Audio in Browser:** The dashboard is visual only - actual voice calls go through your phone
- **Costs:** Vapi charges per minute for calls (check their pricing)
- **Privacy:** Never commit your `.env` file - it contains sensitive API keys
- **Production:** Would require authentication, database, error handling, compliance features

## 🔒 Security

- `.env` file is gitignored and never committed
- API keys should be rotated regularly
- For production: Add authentication, rate limiting, TCPA compliance

## 🐛 Troubleshooting

**Backend won't start:**
- Check all `.env` variables are filled in
- Verify Node.js version: `node --version` (need v18+)
- Try `npm install` again

**Calls not working:**
- Verify Vapi API key is correct (Private Key, not Public)
- Check Assistant ID matches your Vapi assistant
- Ensure phone number format: `+1234567890` (no spaces)
- Check Vapi Dashboard for error logs

**401 Unauthorized:**
- Wrong API key - get new one from Vapi Settings

**No audio in browser:**
- This is expected! Audio comes through actual phone calls
- Run the curl command to trigger a real call

## 📄 License

MIT

## 👨‍💻 Author

Built as a technical interview project demonstrating:
- Voice AI integration
- Real-time conversation management
- Full-stack development
- API design and implementation

**Estimated Build Time:** 3-4 hours

---

⭐ If you found this useful, please star the repo!

For questions or issues, please open a GitHub issue.
