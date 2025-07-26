# Project_Sambhav
# Career Guidance and Skill Development Platform

A modern web application that provides career guidance, skill assessment, and training recommendations using AI and data analytics. The platform includes dashboards for different user roles including administrators, placement officers, trainers, and data collectors.

## 🚀 Features

- **AI-Powered Career Guidance**: Utilizes Google's Generative AI to provide personalized career recommendations
- **Role-Based Dashboards**:
  - **Admin Dashboard**: Manage users, view analytics, and oversee platform operations
  - **Placement Officer Dashboard**: Track student progress and job placements
  - **Trainer Dashboard**: Manage training programs and student progress
  - **Data Collector Dashboard**: Gather and analyze student data
- **Modern Tech Stack**: Built with Next.js 13+ (App Router), React 19, and Tailwind CSS
- **Responsive Design**: Fully responsive interface that works on all devices
- **Secure Authentication**: Integrated with Supabase for secure user management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13+ (App Router)
- **UI**: Tailwind CSS with Radix UI components
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: Google Generative AI
- **PDF Generation**: PDFKit
- **Data Processing**: json2csv

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account
- Google Cloud account with Generative AI API enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/4Kaustubh/Practise-17.git
   cd Team-17-main
   ```

2. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Update environment variables in .env.local
   ```

3. **Set up the backend**
   ```bash
   cd ../backend/js-backend
   npm install
   cp .env.example .env
   # Update environment variables in .env
   ```

4. **Run the development servers**
   ```bash
   # In frontend directory
   npm run dev
   # In a new terminal, from backend directory
   node server.js
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Project Structure

```
Team-17-main/
├── frontend/                 # Next.js frontend
│   ├── app/                  # App router
│   │   ├── admin-dashboard/  # Admin interface
│   │   ├── data-collector-dashboard/  # Data collection interface
│   │   ├── placement-officer-dashboard/  # Placement management
│   │   └── trainer-dashboard/  # Training management
│   ├── components/           # Reusable UI components
│   └── lib/                  # Utility functions
│
└── backend/                  # Node.js backend
    └── js-backend/           # Express server
        ├── routes/           # API routes
        ├── models/           # Database models
        └── services/         # Business logic
```
