# 💬 Chatify - Real-Time Chat Application

## 📸 Screenshots

### 🔐 Login Page
![Login Page](https://github.com/Asraaruddin/MERN-Chat-app/blob/a1add1c66c182af6d7d8fe352fae755bb50a82ad/screenshots/login%20page.png?raw=true)

### 📝 Signup Page
![Signup Page](https://github.com/Asraaruddin/MERN-Chat-app/blob/045e7d478f7a2e157e35ae9d0074c2b7a3d61289/screenshots/Signup%20page.png?raw=true)

### 💬 Chat UI
![Chat UI](https://github.com/Asraaruddin/MERN-Chat-app/blob/a1add1c66c182af6d7d8fe352fae755bb50a82ad/screenshots/chatui.png?raw=true)



**Chatify** is a real-time chat application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) and **Socket.IO**. It supports **1-on-1 messaging**, **group chats**, **real-time typing indicators**, **JWT authentication**, and a sleek **Chakra UI** design.

🚀 [Live Demo](https://talkify-5m26.onrender.com)

---

## ✨ Features

- 🔐 User Authentication (JWT-based)
- 💬 One-on-One and Group Chats
- ⚡ Real-time Messaging with Socket.IO
- ✍️ Typing Indicators
- 🧑‍🤝‍🧑 Group Chat Creation & Renaming
- 🌓 Responsive UI with Chakra UI
- 📦 Protected Routes & API Integration
- 🌐 Deployed on Render (Backend + Frontend)

---

## 🛠️ Tech Stack

**Frontend**  
- React.js  
- Chakra UI  
- Axios  
- Socket.IO Client

**Backend**  
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Socket.IO  
- JWT  
- bcryptjs  
- dotenv

---

## 📁 Project Structure
MERN-Chat-app/
│
├── backend/ # Express backend + real-time server
│ ├── config/ # DB & Cloudinary setup
│ ├── controllers/ # Route handlers (auth, chat, users, messages)
│ ├── middleware/ # Auth middleware
│ ├── models/ # Mongoose models (User, Chat, Message)
│ ├── routes/ # Express route files
│ ├── server.js # App entry point
│ └── .env # Environment config (not in repo)
│
├── frontend/ # React front end with Chakra UI
│ ├── public/ # Static files
│ ├── src/ # Source code
│ │ ├── components/ # Reusable UI components
│ │ ├── context/ # Global state with React Context
│ │ ├── pages/ # Page components (Login, Signup, Chat)
│ │ ├── App.js # Root component & routing
│ │ └── index.js # Entry and render logic
│ ├── package.json
│ └── package-lock.json
│
├── screenshots/ # App UI snapshots
│ ├── signup page.png
│ ├── login page.png
│ └── chatui.png
│
├── .gitignore
├── README.md
└── package.json # Root scripts (build, dev, deploy)

