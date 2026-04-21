# 🏠 Home Fixer

**Home Fixer** is a premium, hyper-local marketplace platform designed to connect residents of Durgapur with verified service professionals like electricians, plumbers, tutors, and more. 

Built with a focus on high performance and modern aesthetics, Home Fixer provides a seamless, secure experience for both customers and service providers.

---

## ✨ Key Features

*   **🤖 Intelligent AI Support:** Integrated **Google Gemini AI** chat agent that helps users find the right professionals and answers service-related queries in real-time.
*   **🔍 Dynamic Search & Filtering:** Sophisticated search engine to find experts by category, service type, or availability.
*   **📍 Google Maps Integration:** Seamless navigation to provider service areas with dynamic URL generation.
*   **💼 Partner Console:** A comprehensive onboarding and management suite for professionals to register services, track orders, and manage their business profile.
*   **💳 Real-time Order Tracking:** End-to-end transaction tracking from booking to completion, powered by a dual-database architecture.
*   **🌗 Modern UI/UX:** A stunning, responsive interface built with **Tailwind CSS v4**, featuring full dark mode support and smooth micro-animations.
*   **🛡️ Dual-Layer Security:** Robust authentication via Firebase and secure data handling using Firestore security rules and Prisma.

---

## 🛠️ Tech Stack

*   **Frontend:** [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
*   **AI:** [Google Gemini AI](https://ai.google.dev/) (Gemini 2.5 Flash)
*   **Database:** 
    *   [Firebase Firestore](https://firebase.google.com/docs/firestore) (Real-time updates)
    *   [Prisma](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/) (Structured data management)
*   **Backend Services:** [Firebase Auth](https://firebase.google.com/docs/auth), [Firebase Storage](https://firebase.google.com/docs/storage)
*   **Deployment:** [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/blackpython34/Durgapur-Local-Services-Finder.git
    cd Durgapur-Local-Services-Finder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your configuration keys:
    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project.firebasestorage.app"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

    # Google Gemini AI
    NEXT_PUBLIC_GEMINI_API_KEY="your_gemini_api_key"

    # Database (Prisma/PostgreSQL)
    DATABASE_URL="postgresql://user:password@localhost:5432/homefixer"
    ```

4.  **Database Migration (Prisma):**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 🚀 Pipeline & Deployment

Home Fixer is optimized for **Static Export** and automated deployment to Firebase.

1.  **Build the project:**
    ```bash
    npm run build
    ```
2.  **Deploy to Firebase:**
    ```bash
    firebase deploy
    ```

> [!IMPORTANT]
> Ensure your domain is added to **Firebase Authentication > Settings > Authorized Domains** to allow successful logins from production.

---

**Developed with ❤️ by Infinity Squad**  
*Empowering the Durgapur community through digital innovation.*
