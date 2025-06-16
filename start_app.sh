#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🏥 Starting PulsePal Healthcare Application${NC}"
echo "================================================"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}Warning: Port $1 is already in use${NC}"
        return 1
    fi
    return 0
}

# Function to install dependencies
install_backend_deps() {
    echo -e "${GREEN}📦 Installing backend dependencies...${NC}"
    cd backend
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
}

install_frontend_deps() {
    echo -e "${GREEN}📦 Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    cd ..
}

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}Error: Please run this script from the PulsePal root directory${NC}"
    exit 1
fi

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
install_backend_deps
install_frontend_deps

# Check ports
echo -e "${GREEN}Checking ports...${NC}"
check_port 5000
check_port 3000

# Create .env file if it doesn't exist
if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}Creating environment file...${NC}"
    echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here" > frontend/.env.local
    echo "CLERK_SECRET_KEY=sk_test_your_secret_key_here" >> frontend/.env.local
    echo "NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in" >> frontend/.env.local
    echo "NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up" >> frontend/.env.local
    echo "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/chatbot" >> frontend/.env.local
    echo "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/chatbot" >> frontend/.env.local
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000" >> frontend/.env.local
    echo -e "${YELLOW}⚠️  Please update the Clerk keys in frontend/.env.local${NC}"
fi

# Start backend
echo -e "${GREEN}🚀 Starting backend server...${NC}"
cd backend
source venv/bin/activate
python run.py &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo -e "${GREEN}🚀 Starting frontend server...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ Application started successfully!${NC}"
echo "================================================"
echo -e "${GREEN}🌐 Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}🔧 Backend:${NC}  http://localhost:5000"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Update Clerk keys in frontend/.env.local"
echo "2. Visit http://localhost:3000 to access the app"
echo "3. Create an account or sign in"
echo ""
echo -e "${GREEN}Press Ctrl+C to stop both servers${NC}"

# Function to cleanup when script is terminated
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for processes
wait