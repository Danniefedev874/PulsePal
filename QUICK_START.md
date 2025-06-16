# 🏥 PulsePal Quick Start Guide

## 🚀 Get Up and Running in 3 Steps

### Step 1: Install Dependencies

**Backend:**
```bash
cd PulsePal/backend
pip install flask flask-cors
```

**Frontend:**
```bash
cd PulsePal/frontend
npm install
```

### Step 2: Start the Servers

**Terminal 1 - Backend:**
```bash
cd PulsePal/backend
python simple_app.py
```

**Terminal 2 - Frontend:**
```bash
cd PulsePal/frontend
npm run dev
```

### Step 3: Access the App

Open your browser and go to: **http://localhost:3000**

## ✅ What Works Now

- ✅ **Authentication** - Sign up/Sign in with Clerk
- ✅ **AI Health Assistant** - Describe symptoms, get advice
- ✅ **Responsive Design** - Works on mobile and desktop
- ✅ **Dark Mode** - Toggle between themes
- ✅ **Modern UI** - Clean, healthcare-focused interface

## 🤖 Test the AI Chatbot

Try these examples:
- "I have a headache and fever"
- "I'm feeling tired and have a cough" 
- "I have stomach pain and nausea"
- "I have chest pain" (urgent symptoms)

## 🔧 Troubleshooting

**If authentication doesn't work:**
- Check that both servers are running
- Verify Clerk keys in `frontend/.env.local`

**If styling looks broken:**
- Make sure frontend is running on port 3000
- Clear browser cache and refresh

**If backend connection fails:**
- Ensure backend is running on port 5000
- Check for error messages in terminal

## 🎯 Next Features to Add

- Advanced ML-based symptom analysis
- Doctor-patient messaging
- Appointment booking system
- Medication tracking
- Health records management

---

**Need help?** Check the full README.md for detailed setup instructions.