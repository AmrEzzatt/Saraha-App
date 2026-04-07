📩 Saraha App (Backend)

A RESTful API for an anonymous messaging platform inspired by Saraha, allowing users to receive honest feedback without revealing the sender's identity.

🚀 Project Overview

Saraha App is a backend system that enables users to:

Create an account and authenticate securely
Receive anonymous messages from others
Share their profile link to collect feedback
Manage their personal data

The goal of this project is to build a secure, scalable, and real-world backend application using modern technologies.

✨ Features
🔐 Authentication System
Signup & login with email and password
Sign in with Google (OAuth)
JWT-based authentication
Password hashing using bcrypt
📩 Anonymous Messaging
Send messages anonymously
Receive private messages
👤 User Management
Get user profile
Update user data
Change password
🛡️ Security
Encrypted passwords
Protected routes using JWT
Environment variables for sensitive data
Request validation
🔐 Authentication Methods
1. Email & Password
Traditional authentication system
Secure password storage using hashing
2. Google OAuth
Login/signup using Google account
Faster and more secure authentication
No need to remember passwords
🛠️ Tech Stack
Runtime: Node.js
Framework: Express.js
Database: MongoDB
ODM: Mongoose
Authentication: JSON Web Token (JWT)
Hashing: bcrypt
OAuth: Google OAuth
Environment Management: dotenv
📂 Project Structure
src/
│── modules/
│   ├── auth/
│   ├── user/
│   └── message/
│
│── middleware/
│── utils/
│── config/
│── app.js
│── server.js
⚙️ Installation & Setup
# Clone the repository
git clone https://github.com/AmrEzzatt/Saraha-App.git

# Navigate to project directory
cd Saraha-App

# Install dependencies
npm install

# Run development server
npm run dev
