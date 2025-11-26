-> JobQuest – Job Application Tracker

A full-stack job tracking platform to manage, monitor, and analyze job applications with interactive dashboards.

-> Tech Stack

Frontend: React, Vite, Recharts
Backend: Node.js, Express.js
Database: MongoDB Atlas
Other: Axios, CORS

-> Features

Add, view, and delete job applications

Visual dashboard: Pie & Bar charts

Cloud DB storage with MongoDB Atlas

Fully responsive UI

REST API with Express.js

Real-time analytics (status, monthly trends)

-> Project Structure
jobquest/
│── backend/

│   ├── index.js

│   ├── models/

│   ├── package.json

│── frontend/

│   ├── src/

│   ├── public/

│   ├── package.json

│── README.md

-> Installation & Setup

1️. Clone repository

git clone https://github.com/Devined4spd/jobquest.git

2️. Backend setup

cd backend
npm install


Create .env:

PORT=4000
MONGO_URI=YOUR_MONGO_ATLAS_URI


Run backend:

node index.js

3️ Frontend setup

cd ../frontend
npm install
npm run dev

-> Dashboard Preview

Status distribution (Pie chart)

Monthly applications (Bar chart)

Overview summary metrics

-> API Endpoints
GET all jobs
GET /api/jobs

POST a job
POST /api/jobs

DELETE a job
DELETE /api/jobs/:id

-> working preview 

<img width="1470" height="769" alt="Screenshot 2025-11-26 at 08 30 25" src="https://github.com/user-attachments/assets/b701872e-cbc1-4537-ad40-866cfb63d7d1" />


-> License

MIT License
