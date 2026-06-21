# 🚀 Buzzline

A modern real-time chat application built with **Next.js**, **TypeScript**, **Socket.io**, **MongoDB**, **Mongoose**, **Shadcn UI**, **Tailwind CSS**, and **NextAuth.js**.

Buzzline enables users to create accounts, choose unique usernames, discover other users, start conversations, exchange messages instantly, and track real-time online presence with live status updates.

---

## 🔗 Live Demo

<p align="center">
  <a href="https://your-vercel-url.com">
  <img src="public/screenshots/favicon.ico" width="20" style="vertical-align:middle"/> &nbsp; Try BuzzLine Live
</a>
</p>

**Frontend:** https://your-vercel-url.vercel.app

**Backend:** Railway Deployment

---

## ✨ Features

### 🔐 Authentication & Authorization

- Google OAuth Authentication using NextAuth.js
- Credentials-Based Signup & Login
- JWT-Based Session Management
- Protected Routes
- Secure Password Hashing with bcrypt

### 👤 User Onboarding

- Unique Username Selection Flow
- Username Availability Validation
- One-Time Username Setup for Google Users
- Persistent User Profiles

### 🔍 User Search

- Search Users by Username
- Debounced Search Requests
- Instant Search Results

### 💬 Real-Time Messaging

- One-to-One Conversations
- Instant Message Delivery using Socket.io
- Automatic Conversation Creation
- Real-Time Chat Updates
- Socket Room-Based Messaging
- Persistent Message History

### 🟢 Presence System

- Real-Time Online Status
- Last Active Tracking
- Live Presence Updates Across Clients
- Automatic Online/Offline Detection

### 🎨 Chat Experience

- Latest Message Preview in Sidebar
- Automatic Conversation Sorting
- Auto Scroll to Latest Messages
- Message Timestamps
- Responsive Chat Interface
- Clean Minimal Design

### ⚙️ Account Management

- Secure Logout Flow
- Session Persistence
- Protected Chat Access

### 🌙 UI / UX

- AMOLED Dark Theme
- Responsive Layout
- Mobile Friendly Design
- Built with Shadcn UI
- Smooth User Experience

---

## 🏗️ System Architecture

```text
┌──────────────────────────────────────────────┐
│                Frontend (Next.js)            │
│                                              │
│  • Login / Signup                            │
│  • Google OAuth                              │
│  • Username Selection                        │
│  • User Search                               │
│  • Chat Interface                            │
│  • Presence UI                               │
└───────────────────┬──────────────────────────┘
                    │
                    │ REST API
                    ▼
┌──────────────────────────────────────────────┐
│            Next.js API Routes                │
│                                              │
│  /api/register                               │
│  /api/auth                                   │
│  /api/users                                  │
│  /api/conversations                          │
│  /api/messages                               │
└───────────────────┬──────────────────────────┘
                    │
                    │ Mongoose
                    ▼
┌──────────────────────────────────────────────┐
│               MongoDB Atlas                  │
│                                              │
│  Users                                       │
│  Conversations                               │
│  Messages                                    │
└──────────────────────────────────────────────┘


                    WebSocket
                         │
                         ▼

┌──────────────────────────────────────────────┐
│            Socket.io Server (3001)           │
│                                              │
│  Presence Management                         │
│  Room Management                             │
│  Real-Time Messaging                         │
│                                              │
│  user-connected                              │
│  user-online                                 │
│  user-offline                                │
│  join-conversation                           │
│  send-message                                │
│  receive-message                             │
└───────────────────┬──────────────────────────┘
                    │
                    ▼
           Conversation Rooms
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
     User A                  User B
```

---

## 🔄 Message Flow

```text
User A
  │
  │ Send Message
  ▼
Next.js API Route
  │
  │ Save Message
  ▼
MongoDB Atlas
  │
  │ Return Saved Message
  ▼
Socket.io Server
  │
  │ socket.to(conversationId)
  ▼
Conversation Room
  │
  ▼
User B Receives Message Instantly
```

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend

- Next.js API Routes
- Node.js
- Socket.io

### Database

- MongoDB Atlas
- Mongoose

### Authentication

- NextAuth.js
- Google OAuth
- JWT

---

# 📸 Screenshots

## Signup

![Signup](public/screenshots/signup.png)

## Login

![Login](public/screenshots/login.png)

## Choose Username

![Choose Username](public/screenshots/choose-username.png)

## User Search

![User Search](public/screenshots/search.png)

## Chat Interface

![Chat Interface](public/screenshots/chat.png)

## Online Status

![Presence](public/screenshots/online.png)

## Last Seen

![Last Seen](public/screenshots/lastseen.png)

## Logout Confirmation

![Logout](public/screenshots/logout.png)

---

## 📂 Project Structure

```bash
Buzzline
│
├── src
│   ├── app
│   ├── components
│   ├── lib
│   ├── models
│   ├── schemas
│   └── types
│
├── public
│
├── screenshots
│
├── socket-server
│   ├── server.js
│   └── User.js
│
├── .env.local
│
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB connection string from MongoDB Atlas
MONGODB_URI=your_mongodb_connection_string

# Random secret string used to sign JWT sessions (use: openssl rand -base64 32)
NEXTAUTH_SECRET=your_nextauth_secret

# Base URL of your app (use http://localhost:3000 for local dev)
NEXTAUTH_URL=http://localhost:3000

# From Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# URL where your Socket.io server is running
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/Czar-16/BuzzLine.git

cd BuzzLine
```

### Install Frontend Dependencies

```bash
npm install
```

### Install Socket Server Dependencies

```bash
cd socket-server

npm install
```

### Run Frontend

```bash
npm run dev
```

Application will be available at:

```txt
http://localhost:3000
```

### Run Socket Server

Open another terminal:

```bash
cd socket-server

node server.js
```

Socket server runs at:

```txt
http://localhost:3001
```

---

## 📈 Key Highlights

- Built a production-style real-time chat platform using Socket.io
- Implemented conversation-based WebSocket room architecture
- Developed a real-time online presence system with last-active tracking
- Integrated Google OAuth and Credentials Authentication
- Built username-based user discovery and onboarding flow
- Designed normalized MongoDB schemas for Users, Conversations, and Messages
- Created a responsive AMOLED dark-themed user interface
- Implemented automatic conversation management and message persistence

---

## 🌐 Deployment

### Frontend

Deploy using:

- Vercel

### Socket Server

Deploy using:

- Railway

### Database

- MongoDB Atlas

---

## 🔗 Live Demo

Coming Soon...

Frontend: TBD

Socket Server: TBD

---

## 👨‍💻 Author

### Anoop Jha (Czar16)

- GitHub: https://github.com/Czar-16
- Twitter/X: https://x.com/itsCzar16

---

⭐ If you found this project useful, consider giving it a star.
