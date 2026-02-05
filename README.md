# DocumentAI - Chat Application with AI Integration

A full-stack chat application that leverages AI (Google Gemini) to provide intelligent conversations with document analysis capabilities. Built with modern web technologies for scalability and performance.

---

## 📋 Table of Contents

- [Project Links](#project-links)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Deployment Notes](#deployment-notes)
- [Trade-offs & Known Limitations](#trade-offs--known-limitations)

---

## 🔗 Project Links

| Resource | URL |
|----------|-----|
| **GitHub Repository** | `https://github.com/javeed141/Document` |
| **Live Frontend (Vercel)** | `https://document-mi49.onrender.com` |
| **Live Backend API (Render)** | `https://document-gold.vercel.app/` |

---

## � Project Structure

```
DOCUMENTAI/
├── backend/
│   ├── index.js                          # Main server file
│   ├── package.json                      # Backend dependencies
│   ├── .env                              # Environment variables (not in Git)
│   ├── .env.example                      # Example environment file
│   ├── readme.md                         # Backend-specific documentation
│   │
│   ├── middleware/
│   │   └── authMiddleware.js             # JWT authentication middleware
│   │
│   ├── models/
│   │   ├── Chat.js                       # Chat schema & model
│   │   ├── Message.js                    # Message schema & model
│   │   └── Users.js                      # User schema & model
│   │
│   ├── routes/
│   │   ├── auth.js                       # Authentication endpoints
│   │   └── chats.js                      # Chat & message endpoints
│   │
│   └── services/
│       └── ai_service.js                 # Google Gemini AI integration
│
├── fronted/
│   ├── index.html                        # HTML entry point
│   ├── package.json                      # Frontend dependencies
│   ├── vite.config.ts                    # Vite configuration
│   ├── tsconfig.json                     # TypeScript configuration
│   ├── eslint.config.js                  # ESLint configuration
│   ├── vercel.json                       # Vercel deployment config
│   ├── components.json                   # UI components config
│   ├── .env.example                      # Example environment file
│   ├── .env.local                        # Local environment variables (not in Git)
│   │
│   ├── public/                           # Static assets
│   │
│   └── src/
│       ├── main.tsx                      # React entry point
│       ├── App.tsx                       # Main App component
│       ├── App.css                       # Global styles
│       ├── index.css                     # Base styles
│       │
│       ├── api/
│       │   └── api.tsx                   # Axios instance & API config
│       │
│       ├── assets/                       # Images, fonts, media
│       │
│       ├── components/
│       │   ├── ChatSidebar.tsx           # Chat list sidebar
│       │   ├── ChatSidebar.css           # Sidebar styles
│       │   ├── EmptyState.tsx            # Empty state component
│       │   ├── LoadingState.tsx          # Loading skeleton
│       │   ├── MessageBubble.tsx         # Individual message bubble
│       │   ├── MessageInput.tsx          # Message input box
│       │   ├── MessageList.tsx           # Message list container
│       │   │
│       │   ├── auth/
│       │   │   ├── Home.tsx              # Landing/home page
│       │   │   ├── login.tsx             # Login page
│       │   │   └── register.tsx          # Registration page
│       │   │
│       │   ├── roles/                    # Role-based components (future)
│       │   │
│       │   └── ui/                       # Reusable UI components
│       │       ├── avatar.tsx
│       │       ├── button.tsx
│       │       ├── card.tsx
│       │       ├── dialog.tsx
│       │       ├── dropdown-menu.tsx
│       │       ├── input.tsx
│       │       ├── label.tsx
│       │       ├── skeleton.tsx
│       │       ├── sonner.tsx
│       │       ├── spinner.tsx
│       │       └── textarea.tsx
│       │
│       ├── context/
│       │   └── ThemeContext.tsx          # Dark/light theme context
│       │
│       ├── lib/
│       │   └── utils.ts                  # Utility functions
│       │
│       └── pages/
│           ├── ChatPage.tsx              # Main chat page
│           └── NotFound.tsx              # 404 page
│
├── .git/                                 # Git repository
├── .gitignore                            # Git ignore rules
├── README.md                             # This file
└── REQUIREMENTS_ASSESSMENT.md            # Requirements check document
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `backend/` | Express.js REST API with MongoDB integration |
| `fronted/` | React + TypeScript frontend application |
| `backend/models/` | Mongoose schemas for database entities |
| `backend/routes/` | API route handlers |
| `backend/services/` | Business logic (AI integration) |
| `fronted/src/components/` | Reusable React components |
| `fronted/src/pages/` | Page-level components |
| `fronted/src/context/` | React Context for state management |

---

## 🔗 Project Links

### Frontend
- **React 19.2** - UI library for building interactive interfaces
- **TypeScript 5.9** - Type-safe JavaScript for better development experience
- **Vite 7.2** - Next-generation frontend build tool (fast dev server & optimized builds)
- **React Router v7** - Client-side routing
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Axios** - HTTP client for API communication
- **Sonner** - Toast notifications
- **Next Themes** - Dark mode support

### Backend
- **Node.js with Express 5.2** - REST API framework
- **MongoDB 9.1** - Document database with Mongoose ORM
- **Google Generative AI (Gemini 2.5 Flash)** - AI model for generating responses
- **JWT (jsonwebtoken 9.0)** - Authentication & authorization
- **Bcrypt 6.0** - Password hashing
- **CORS** - Cross-origin resource sharing for frontend communication
- **dotenv** - Environment variable management

### DevOps & Deployment
- **Vercel** - Frontend hosting & deployment
- **Render** - Backend API hosting
- **MongoDB Atlas** - Cloud database hosting

---

## ✨ Features

- **User Authentication** - Secure login/register with JWT and password hashing
- **Real-time Chat** - Send and receive messages with AI assistance
- **AI-Powered Responses** - Google Gemini integration for intelligent conversations
- **User Management** - MongoDB-based user profiles and session management
- **Dark Mode Support** - Theme switching capability
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **Error Handling** - Comprehensive error management with toast notifications

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB Atlas account (for cloud database) or local MongoDB instance
- Google Generative AI API key (from Google AI Studio)
- Git

### Clone the Repository

```bash
git clone [YOUR_GITHUB_REPOSITORY_URL]
cd DOCUMENTAI
```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (see [Environment Variables](#environment-variables) section)

4. **Start the server**
   ```bash
   npm start
   ```
   Server will run on `http://localhost:5000`

   For development with auto-reload:
   ```bash
   npx nodemon index.js
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd fronted
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local` file** (see [Environment Variables](#environment-variables) section)

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

---

## 🔑 Environment Variables

### Backend (`.env` file in `/backend`)

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]?retryWrites=true&w=majority

# AI Model
GEMINI_API_KEY=your_google_generative_ai_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# JWT (Optional - add if implementing JWT)
JWT_SECRET=your_jwt_secret_key_here
```

### Frontend (`.env.local` file in `/fronted`)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Chat Routes (`/api/chats`)
- `GET /api/chats` - Get all chats for user
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id` - Get specific chat
- `POST /api/chats/:id/messages` - Send message (triggers AI response)
- `DELETE /api/chats/:id` - Delete chat

### Health Check
- `GET /health` - API health status

---


### Environment Variables in Production

Update these variables in your deployment platform's dashboard:

**Vercel (Frontend)**
- `VITE_API_URL` - Your Render API URL

**Render (Backend)**
- `MONGODB_URI` - MongoDB Atlas connection string
- `GEMINI_API_KEY` - Google Generative AI key
- `FRONTEND_URL` - Your Vercel frontend URL
- `JWT_SECRET` - Secure random string for JWT signing
- `NODE_ENV` - Set to `production`

---
