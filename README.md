# QGen - AI Question Generator

![Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![Frontend](https://img.shields.io/badge/frontend-React_%2B_Vite-61DAFB?style=flat-square)
![Backend](https://img.shields.io/badge/backend-Node.js_%2B_Express-339933?style=flat-square)
![Deployment](https://img.shields.io/badge/deployed_on-Render-46E3B7?style=flat-square)

## 📖 About The Project

**QGen** is a full-stack web application designed to generate and manage questions intelligently. It features a responsive frontend built with React and a robust Node.js backend that handles data persistence and API history.

### 🌟 Key Features
* **Question Generation:** Generate content dynamically based on user input.
* **History Tracking:** Automatically saves generated questions and allows users to view past history (`/api/history`).
* **Responsive UI:** Optimized for desktop and mobile devices.
* **Secure API:** Handles cross-origin requests (CORS) efficiently.

## 🚀 Live Demo
Check out the live application here:
👉 **[https://qgen-frontend1.onrender.com/]**

---

## 🛠️ Tech Stack

### Frontend
* **React.js (Vite):** For fast development and optimized builds.
* **Axios:** For handling HTTP requests and API integration.
* **CSS/Tailwind:** For styling.

### Backend
* **Node.js & Express:** Server-side logic and routing.
* **MongoDB (Mongoose):** Database for storing question history.
* **Cors:** Middleware for handling cross-origin resource sharing.

---

## 📂 Project Structure

```text
/
├── frontend/           # React Client Application
│   ├── src/
│   ├── public/
│   └── .env            # Frontend Environment Variables
├── backend/            # Express Server Application
│   ├── models/         # Database Schemas
│   ├── routes/         # API Routes
│   └── .env            # Backend Environment Variables
└── README.md
