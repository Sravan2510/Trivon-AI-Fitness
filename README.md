# 🏋️‍♂️ Trivion AI Fitness

**Trivion** is a cutting-edge fitness ecosystem designed to revolutionize personal health management. By integrating intelligent workout tracking, personalized nutrition planning, and a virtual fitness companion, Trivion offers a seamless, premium experience inspired by the Apple ecosystem.

## 🚀 Key Features

- **📊 Smart Dashboard**
  - Real-time visualization of calories, workout history, and streaks.
  - **IoT Simulator**: Simulates live heart rate telemetry.
  - **Habit Tracker**: Track daily goals like water intake and sleep.

- **💪 AI Trainer**
  - **Workout Planner**: Choose from routines like Full Body, Push Day, and Leg Day.
  - **Interactive Timers**: Guided exercise sessions with built-in rest and duration tracking.
  - **Performance Logging**: Automatically saves workout data to your profile.

- **🍎 AI Dietician**
  - **Custom Meal Plans**: Generates tailored diet plans based on BMI, goals, and dietary preferences.
  - **Smart Grocery Lists**: Converts meal plans into organized shopping checklists.

- **💬 Gym Buddy**
  - **Virtual Companion**: An encouraging AI chat interface for motivation and fitness advice.
  - **Context-Aware**: Remembers your conversation context for a natural experience.

- **⚙️ User System**
  - **Persistent Profiles**: Saves user stats and settings locally.
  - **Secure Simulation**: Realistic authentication flow (Login/Sign Up).
  - **Dark/Light Mode**: Adaptive glassmorphism UI.

---

## 🛠️ Technical Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Glassmorphism & Apple Human Interface guidelines)
- **Intelligence**: Advanced Generative AI Models
- **Visualization**: Recharts
- **Icons**: FontAwesome

---

## 💻 Installation Guide

Follow these steps to set up and run the project locally.

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v16 or higher) - [Download Here](https://nodejs.org/)
- **Git** - [Download Here](https://git-scm.com/)

### 2. Clone the Repository
Open your terminal or command prompt and run:

```bash
git clone https://github.com/your-username/trivion-ai-fitness.git
cd trivion-ai-fitness
```

### 3. Install Dependencies
Install the required software packages:

```bash
npm install
```

### 4. Configure Environment
This application requires an API key to power its AI features.

1.  Create a new file in the root directory named `.env`.
2.  Add your API key to this file:

```env
API_KEY=your_api_key_here
```

> **Note:** You can obtain an API key from the relevant AI provider's developer console.

### 5. Run the Application
Start the local development server:

```bash
npm run dev
```

After running the command, open your browser and navigate to the local link provided (usually `http://localhost:5173`).

---

## 📂 Project Structure

```
trivion-ai-fitness/
├── src/
│   ├── components/      # UI Components (Dashboard, Trainer, etc.)
│   ├── services/        # API Integration logic
│   ├── App.tsx          # Main Application Logic & Routing
│   ├── types.ts         # TypeScript Definitions
│   └── main.tsx         # Entry Point
├── index.html           # HTML Root & Tailwind Config
├── package.json         # Project Dependencies
└── README.md            # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

*Prototype Build v1.3*
