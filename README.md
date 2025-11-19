# LokVidhi - Indian Law, Simplified 🇮🇳⚖️

> **Understand your legal rights without the legalese.** LokVidhi transforms complex Indian legal codes into interactive stories, simple guides, and practical tools that everyday citizens can actually use.

![LokVidhi Banner](./docs/_assets/Banner.png)

---

## 📖 About

LokVidhi is a comprehensive legal literacy platform designed to make Indian law accessible to everyone. Whether you're dealing with unpaid salary, rental disputes, or just want to understand your rights if arrested, LokVidhi provides:

- **Interactive Legal Scenarios** - Learn by doing through real-life situations
- **Smart Calculators** - Instantly compute severance pay, rent deposits, and more
- **AI Legal Assistant** - Ask questions in plain English (or Hindi) and get answers based on actual Bare Acts
- **Grounded in Reality** - Powered by Google Search integration for fact-checked, up-to-date information

---

## 🏠 Homepage

![Home](./docs/_assets/Homepage.png)

The landing page features three core offerings:

1. **Interactive Scenarios** - Play through real-life legal situations
2. **Legal Calculators** - Quick answers to common financial legal questions  
3. **AI Legal Bot (Beta)** - Conversational legal assistant for personalized queries

---

## 🔐 Authentication

![Sign In Page](./docs/_assets/Login.png)

**Features:**
- Secure email/password authentication
- Google OAuth integration for quick sign-in
- Protected routes for personalized experiences
- User session management

---

## 🎭 Interactive Scenarios

![Scenarios Page](./docs/_assets/Scenarios.png)

Each scenario teaches legal concepts through narrative choices, making complex laws easy to understand and remember.

Example:
**"Salary Not Paid?"** (Beginner Level)
- Step-by-step walkthrough of filing a labor complaint
- Decision tree based on real provisions of the Industrial Disputes Act
- Learn about demand notices, labor courts, and your rights as an employee

---

## 🧮 Legal Calculators

![Calculators Page](./docs/_assets/Calculators.png)

### 1. **Salary & Severance Pay Calculator**
Calculate minimum gratuity and notice pay you're legally entitled to upon job termination or resignation.

### 2. **Rent Deposit & Notice Analyzer**
Verify if your security deposit amount is within legal state limits and check the minimum required notice period.

**Formula:** Based on state-specific Rent Control Acts and the Model Tenancy Act principles.

---

## 🤖 AI Legal Assistant

![AI Assistant Chat](./docs/_assets/Assistant.png)

**Powered by Google Gemini 2.5 Flash with Search Grounding**

Ask questions like:
- "What are my rights if arrested?"
- "How do I file an RTI?"
- "What is Section 498A IPC?"

**Key Features:**
- Answers based on actual Indian Bare Acts (IPC, CrPC, Contract Act, etc.)
- Fact-checked with real-time Google Search integration
- Provides source citations for transparency
- Disclaimer included: "I am an AI, not a lawyer. Please consult a professional for serious legal matters."

---

## 🛠️ Tech Stack

**Frontend (Next.js)**
- React 18 with TypeScript
- Tailwind CSS for styling
- Server-side rendering for SEO

**Backend (Node.js + Express)**
- RESTful API architecture
- PostgreSQL database for scenario content
- Google Gemini API integration for AI chatbot

**Infrastructure**
- CORS-enabled API
- Environment-based configuration
- Modular route structure

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/lokvidhi.git
cd lokvidhi
```

2. **Install dependencies**
```bash
# Install API dependencies
cd api
npm install

# Install Web dependencies
cd ../web
npm install
```

3. **Set up environment variables**

Create `.env` files in both `api/` and `web/` directories:

**api/.env**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/lokvidhi
PORT=4000
GEMINI_API_KEY=your_gemini_api_key_here
```

**web/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. **Set up the database**
```bash
# Create the database and run migrations
cd api
# (Add your SQL schema here or migration commands)
```

5. **Run the development servers**

```bash
# Terminal 1 - API Server
cd api
npm run dev

# Terminal 2 - Web App
cd web
npm run dev
```

Visit `http://localhost:3000` to see the app in action!

---

## 📁 Project Structure

```
lokvidhi/
├── api/                    # Backend API (Express + TypeScript)
│   ├── routes/
│   │   ├── scenario.ts     # Scenario progression logic
│   │   ├── calculator.ts   # Severance pay calculator
│   │   ├── rent.ts         # Rent deposit calculator
│   │   └── chatbot.ts      # AI assistant endpoint
│   ├── db.ts               # PostgreSQL connection
│   ├── server.ts           # Express app setup
│   └── package.json
│
├── web/                    # Frontend (Next.js + React)
│   ├── pages/              # Page routes
│   ├── components/         # React components
│   ├── public/             # Static assets
│   └── package.json
│
└── README.md
```

---

## 🎯 Roadmap

- [x] Interactive scenario system
- [x] Salary & severance calculator
- [x] Rent deposit analyzer
- [x] AI chatbot with search grounding
- [ ] More scenarios (Consumer Rights, Contract Disputes)
- [ ] Mobile app (React Native)
- [ ] Hindi language support
- [ ] User progress tracking
- [ ] Lawyer directory integration

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⚖️ Legal Disclaimer

**LokVidhi is an educational tool and NOT a substitute for professional legal advice.** 

While we strive for accuracy, laws change frequently and vary by jurisdiction. Always consult a qualified lawyer for specific legal matters. The creators and contributors of LokVidhi assume no liability for actions taken based on information provided by this platform.

---

## 🙏 Acknowledgments

- **Indian Bare Acts** - All legal content is derived from publicly available legal texts
- **Google Gemini** - Powers our AI assistant with search grounding
- **PostgreSQL** - Reliable database for scenario content
- **Next.js & Express** - Robust frameworks for modern web development

---

## 📧 Contact

**Project Maintainer:** Vaibhav  
**Email:** vaibhav0460@gmail.com
**Website:** [https://vaibhav0460.github.io/](https://vaibhav0460.github.io/)

---

<p align="center">Made with ❤️ for the people of India</p>
<p align="center">⚖️ Know Your Rights • Own Your Future ⚖️</p>
