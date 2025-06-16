# 🏥 PulsePal - Healthcare Chatbot Application

A comprehensive healthcare application that combines AI-powered symptom analysis with patient-doctor communication features.

## 🚀 Features

### For Patients
- **AI Health Assistant**: Describe symptoms and get AI-powered health insights
- **Doctor Chat**: Communicate directly with healthcare providers
- **Appointment Booking**: Schedule appointments with doctors
- **Medication Tracking**: Mark medications and request prescription refills
- **Health Records**: Track your health history and diagnoses

### For Doctors
- **Patient Communication**: Chat with patients and provide guidance
- **Appointment Management**: View and manage scheduled appointments
- **Medication Management**: Prescribe and monitor patient medications
- **Patient Health Records**: Access patient symptoms and diagnosis history

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Clerk** - Authentication
- **Lucide React** - Icons

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **Flask-Login** - Session management
- **Flask-CORS** - Cross-origin requests
- **scikit-learn** - AI/ML for symptom analysis

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PulsePal
```

### 2. Set Up Clerk Authentication
1. Create a free account at [Clerk.dev](https://clerk.dev)
2. Create a new application
3. Copy your API keys

### 3. Configure Environment Variables
Update `frontend/.env.local` with your Clerk keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/chatbot
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/chatbot
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Run the Application
```bash
# Make the startup script executable
chmod +x start_app.sh

# Start both frontend and backend
./start_app.sh
```

The script will:
- Install all dependencies
- Start the backend server on port 5000
- Start the frontend server on port 3000
- Open both services automatically

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 Manual Setup (Alternative)

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📊 Database Schema

The application uses SQLite with the following models:
- **User**: Patient and doctor profiles
- **Appointment**: Scheduled appointments
- **Medication**: Prescribed medications
- **ChatMessage**: Doctor-patient communications
- **HealthRecord**: Patient health history

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Health Assistant
- `POST /api/chatbot` - Send symptoms for AI analysis

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Book new appointment

### Medications
- `GET /api/medications` - Get user medications
- `POST /api/medications` - Add new medication

### Chat
- `GET /api/chat` - Get chat messages
- `POST /api/chat` - Send chat message

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile
- **Dark Mode Support**: Toggle between light and dark themes
- **Real-time Chat**: Instant messaging between doctors and patients
- **Modern Interface**: Clean, healthcare-focused design
- **Accessibility**: WCAG compliant interface

## 🔒 Security

- **Authentication**: Clerk-powered secure authentication
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: Server-side validation for all inputs
- **Session Management**: Secure session handling

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Backend (Railway/Heroku)
1. Create account on Railway or Heroku
2. Connect repository
3. Set environment variables
4. Deploy with Python buildpack

## 🐛 Troubleshooting

### Common Issues

**1. CSS Styles Not Loading**
- Ensure Tailwind CSS is properly configured
- Check that globals.css is imported in _app.tsx
- Verify Next.js is running in development mode

**2. Authentication Issues**
- Verify Clerk API keys in .env.local
- Check middleware.ts is properly configured
- Ensure public routes are correctly set

**3. Backend Connection Issues**
- Verify backend is running on port 5000
- Check CORS configuration
- Ensure API_URL is correct in frontend

**4. Database Issues**
- Database tables are created automatically
- Check file permissions for SQLite
- Verify backend dependencies are installed

### Port Conflicts
If ports 3000 or 5000 are in use:
```bash
# Find process using port
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>
```

## 📝 Development

### Adding New Features
1. Backend: Add routes in `healthapp/routes.py`
2. Frontend: Create API calls in `lib/api.ts`
3. UI: Add components in `pages/` directory

### Database Changes
1. Update models in `healthapp/models.py`
2. Database auto-creates tables on startup
3. For production, implement proper migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the GitHub issues
3. Create a new issue with detailed information

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Video consultations
- [ ] Lab results integration
- [ ] Insurance verification
- [ ] Pharmacy integration
- [ ] Mobile app development

---

**⚠️ Important**: This application is for educational purposes. Always consult healthcare professionals for medical advice.