# Nexus Platform - Professional Services Portal

> A modern, AI-powered web application showcasing advanced React patterns, real-time voice AI, and smooth animations. Built as a portfolio demonstration of full-stack development capabilities.

## 📺 Demo

**[Video Demo Coming Soon]**

## ✨ Features

- 🎨 **Modern UI/UX** - Purple-blue gradient design system with glass morphism
- 🤖 **Dual AI Assistants** - Text chat and real-time voice conversations
- ⚡ **Smooth Animations** - Framer Motion powered transitions
- 📱 **Fully Responsive** - Mobile-first design
- 🛒 **Complete User Flow** - Login → Selection → Checkout → Confirmation
- 📄 **PDF Generation** - Downloadable quotes with professional formatting

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5000`

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Vite  
**Routing:** React Router  
**Styling:** Tailwind CSS v4, Radix UI, shadcn/ui  
**Animations:** Framer Motion  
**AI:** Azure OpenAI (Chat & Realtime Voice)  
**PDF:** jsPDF  
**Icons:** Phosphor Icons

## 📁 Structure

```
src/
├── pages/          # Main app pages (Login, Selection, Checkout, ThankYou)
├── components/     # Reusable components + UI primitives
├── lib/           # Utilities (Azure OpenAI, PDF generator)
└── styles/        # Global styles and theme
```

## 🎯 User Journey

1. **Login** - Animated entrance with social auth options
2. **Service Selection** - AI-assisted service picker with voice support
3. **Checkout** - Order review with pricing breakdown
4. **Confirmation** - Thank you page with order ID

## 🤖 AI Features

### Text Chat
Context-aware conversations with service recommendations

### Voice Assistant  
Real-time voice using Azure OpenAI Realtime API with automatic service selection

## ⚙️ Environment Setup

Create `.env` file:

```env
VITE_AZURE_OPENAI_ENDPOINT=your_endpoint
VITE_AZURE_OPENAI_API_KEY=your_key
VITE_AZURE_OPENAI_DEPLOYMENT=your_deployment
VITE_AZURE_REALTIME_ENDPOINT=your_realtime_endpoint
VITE_AZURE_REALTIME_API_KEY=your_realtime_key
VITE_AZURE_REALTIME_DEPLOYMENT=gpt-realtime
```

## 🚢 Deploy

```bash
npm run build
# Deploy dist/ folder to Vercel, Netlify, or Azure Static Web Apps
```

## 📄 License

MIT - Free for personal and commercial use

---

**Portfolio Project** | [GitHub](https://github.com/eduxfernandes05) | Built with React + TypeScript + AI
