# PulsePal Development Setup

## Quick Setup for Easy Testing

This guide helps you set up PulsePal with minimal authentication requirements for development.

### 1. Clerk Dashboard Configuration

Go to your Clerk dashboard and configure the following settings:

**Email Settings:**
- Go to User & Authentication → Email, Phone, Username
- Disable "Verify email address" 
- Set "Email address" to required but not verified

**Password Settings:**
- Go to User & Authentication → Attack Protection
- Disable "Password complexity requirements"
- Set minimum password length to 1 character

**Session Settings:**
- Go to Sessions → Settings  
- Disable "Multi-session handling"
- Set session timeout to maximum

### 2. Environment Configuration

Your `.env.local` file is already configured with:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aHVtb3JvdXMtamF5LTEwLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_W9EI6hhX4UvOkdWLqxajUUXyYghTSLDnYBc8R9HmyB
NEXT_PUBLIC_CLERK_SKIP_EMAIL_VERIFICATION=true
CLERK_FORCE_DEV_MODE=true
```

### 3. Testing Authentication

**Sign Up:**
- Email: `test@test.com` (or any email format)
- Password: `123` (or any simple password)
- No email verification required
- Automatically logged in after signup

**Sign In:**
- Use the same credentials you signed up with
- No OTP codes required

### 4. Start the Application

**Terminal 1 (Backend):**
```bash
cd PulsePal/backend
python run.py
```

**Terminal 2 (Frontend):**
```bash
cd PulsePal/frontend
npm run dev
```

**Access:** http://localhost:3000

### 5. Quick Test Flow

1. Go to homepage → Click "Sign Up"
2. Enter any email/password → Submit
3. Automatically redirected to chatbot
4. Test symptoms: "I have a headache and fever"
5. Get AI-powered health recommendations

### 6. CSS Customizations

The app includes custom CSS to hide:
- Development mode warnings
- Password complexity requirements
- Email verification prompts
- Social login options
- Unnecessary form fields

### 7. Troubleshooting

**If you still see verification prompts:**
1. Clear browser cache and cookies
2. Restart both servers
3. Try incognito/private browsing mode

**If authentication fails:**
1. Check Clerk dashboard settings
2. Verify environment variables are correct
3. Ensure both servers are running

The setup is now optimized for quick development testing with minimal authentication barriers.