# Career AI — Empowering Your Professional Journey 🚀

Career AI is a modern, AI-driven career guidance platform built with the MERN stack. It leverages the power of Google's Gemini AI to provide personalized career roadmaps, deep career comparisons, and professional assessments, helping users navigate their career paths with data-driven insights.

![Career AI Banner](https://images.unsplash.com/photo-1454165833767-1316b34b1195?q=80&w=2070&auto=format&fit=crop)

## ✨ Core Features

### 🗺️ AI Roadmap Generator
Get a step-by-step, actionable career roadmap tailored to your specific goals. 
- Integrated with **Gemini 2.0 Flash** for high-quality guidance.
- Saves historical roadmaps to your dashboard for future reference.
- Export as Markdown or PDF (coming soon).

### 📊 Professional Career Comparison
Compare different career paths side-by-side across multiple metrics:
- **Salary Data**: Understand your earning potential.
- **Growth Outlook**: See which industries are booming.
- **Skills Check**: Identify skill gaps between different roles.
- **Email Sharing**: Send your comparison reports directly to your inbox.

### 🧪 Career Assessment Test
Not sure where to start? Take our AI-enhanced career test to discover roles that align with your personality and interests.
- Dynamic questioning powered by AI logic.
- Instant analysis and pathway recommendations.

### 📈 User Dashboard
A centralized hub to track your progress:
- Access saved roadmaps.
- Review your assessment history.
- Manage your profile and settings.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: `React 19` (Vite)
- **Styling**: `Tailwind CSS 4`
- **Icons**: `Lucide React` & `React Icons`
- **Auth**: `Clerk` (Secure user authentication)
- **State Management**: React Hooks
- **Toasts**: `Sonner` & `React Hot Toast`

### Backend
- **Runtime**: `Node.js`
- **Framework**: `Express 5`
- **Databases**: 
  - `MongoDB` (Primary data storage)
  - `MySQL` (Relational data / Historical models)
- **AI**: `Google Generative AI` (Gemini SDK)
- **Authentication**: `@clerk/express` & `@clerk/clerk-sdk-node`
- **Emailing**: `Nodemailer` & `SendGrid`

---

## 📂 Project Structure

```text
├── client/              # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components (Home, Dashboard, etc.)
│   │   ├── services/    # API calling functions
│   │   └── assets/      # Static assets and styles
├── server/              # Node.js backend (Express)
│   ├── controllers/     # Route logic handlers
│   ├── models/          # Database schemas (Mongoose)
│   ├── routes/          # API endpoint definitions
│   └── config/          # Database & Middleware configs
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Clerk account (for Auth)
- Google AI Studio API Key (for Gemini)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Career-AI-MERN.git
   cd Career-AI-MERN
   ```

2. **Setup Backend**:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=3001
   MONGO_URI=your_mongodb_uri
   GEMINI_API_KEY=your_gemini_api_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   # Email Config (Optional)
   SENDGRID_API_KEY=your_sendgrid_key
   ```

3. **Setup Frontend**:
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:3001
   ```

4. **Run the Application**:
   - Start Backend: `cd server && npm run dev`
   - Start Frontend: `cd client && npm run dev`

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the ISC License.
