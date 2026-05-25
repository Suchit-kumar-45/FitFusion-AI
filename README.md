# FitFusion AI - AI-Powered Fitness Companion

**FitFusion AI** is a full-stack web application that combines AI-generated fitness plans with an interactive fitness coaching chatbot. Get personalized workout routines, diet plans, and real-time fitness guidance powered by Google's Gemini AI.

## 🌟 Features

- **User Authentication** - Secure registration and login with JWT tokens
- **AI Workout Generator** - Generate personalized workout plans based on your goals, weight, height, and fitness level
- **AI Diet Planner** - Create customized meal plans based on dietary preferences and calorie targets
- **AI Fitness Coach** - Interactive chat with an AI fitness coach for real-time guidance
- **Progress Tracking** - Monitor your fitness progress over time
- **Responsive Dashboard** - Central hub displaying fitness stats and all features

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Google Generative AI** (Gemini 1.5 Flash)
- **JWT** for authentication
- **bcrypt** for password hashing

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** for styling

## 📋 Prerequisites

Before starting, make sure you have installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB connection string (local or cloud)
- Google Gemini API key (get it from [Google AI Studio](https://aistudio.google.com/app/apikey))

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FitFusion-AI
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
# - MongoDB URI
# - JWT Secret
# - Gemini API Key
# - Port (default: 5000)

# Start the backend server
npm start
# Or for development with auto-reload:
npm run dev
```

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔑 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Workouts (Protected)
- `POST /api/workout/generate` - Generate personalized workout plan

### Diet (Protected)
- `POST /api/diet/generate` - Generate personalized diet plan

### Chat (Protected)
- `POST /api/chat/ask` - Ask the AI fitness coach

### Progress (Protected)
- `POST /api/progress/add` - Add progress record
- `GET /api/progress/my` - Get user's progress history
- `PUT /api/progress/:id` - Update progress record
- `DELETE /api/progress/:id` - Delete progress record

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

The token is automatically stored in localStorage after login and included in all API requests.

## 📖 How to Use

### 1. Register
- Go to `/register` page
- Fill in your name, email, and password
- Submit to create your account

### 2. Login
- Go to `/login` page
- Enter your email and password
- You'll be redirected to the dashboard

### 3. Generate Workout
- Navigate to `/workout` page
- Fill in your fitness goal, weight, height, and level
- Click "Generate Workout Plan"
- View your personalized workout routine

### 4. Generate Diet Plan
- Navigate to `/diet` page
- Select your goal, diet type, and daily calories
- Click "Generate Diet Plan"
- View your meal recommendations

### 5. Chat with AI Coach
- Navigate to `/chat` page
- Ask any fitness-related questions
- Get instant AI-powered responses

### 6. Track Progress
- Add weight and progress notes
- View your progress history
- Update or delete past records

## 🏗️ Project Structure

```
FitFusion-AI/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & API configuration
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Authentication middleware
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic & AI integration
│   │   └── utils/           # Utility functions
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   ├── package.json
│   └── .env                # Environment variables
│
└── client/
    ├── src/
    │   ├── components/      # Reusable React components
    │   ├── contexts/        # React Context (Auth)
    │   ├── pages/          # Page components
    │   ├── services/       # API service calls
    │   ├── styles/         # CSS styles
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## 🔄 API Request/Response Examples

### Generate Workout
**Request:**
```bash
POST /api/workout/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "goal": "Muscle Gain",
  "weight": 70,
  "height": 175,
  "level": "Beginner"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439012",
  "goal": "Muscle Gain",
  "workoutPlan": "Day 1: Chest...",
  "createdAt": "2024-05-23T10:30:00Z"
}
```

### Ask AI Coach
**Request:**
```bash
POST /api/chat/ask
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How do I build muscle faster?"
}
```

**Response:**
```json
{
  "reply": "To build muscle faster, focus on..."
}
```

## ⚠️ Validation & Error Handling

- All inputs are validated on both frontend and backend
- Password must be at least 6 characters
- Email validation with regex pattern
- Proper error messages for all failed requests
- JWT token expiration after 7 days

## 🚨 Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT authentication for protected routes
- Protected API endpoints with auth middleware
- Email validation
- CORS configured for frontend origin only
- Environment variables for sensitive data

## 🐛 Troubleshooting

### "Connection to MongoDB failed"
- Check your MongoDB connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas

### "Invalid API Key"
- Verify your Gemini API key is correct
- Make sure the API is enabled in Google Cloud Console

### "CORS Error"
- Check that backend is running on port 5000
- Check that frontend is running on port 5173
- Verify CORS configuration in `app.js`

### "Token expired"
- Token expires after 7 days
- Login again to get a new token

## 📝 Development Notes

- Use `npm run dev` in backend for automatic reload with nodemon
- Frontend automatically reloads with Vite
- All API calls include error handling
- Input validation on both client and server side

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Happy Fitness Journey!** 💪🎯