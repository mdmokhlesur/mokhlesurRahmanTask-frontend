# Coder71 - Frontend (Recursive Screen Splitter)

This is the frontend portion of the Recursive Screen Splitter application, built with React, Vite, and TypeScript.

## 🛠️ Tech Stack
- **React 19**: UI Framework
- **Vite**: Build Tool & Dev Server
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations for splitting actions
- **Lucide React**: Icon library
- **React Hot Toast**: UI Notifications

## ⚙️ Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and configure the backend URL:
   ```bash
   cp .env.example .env
   ```
   *Default:* `VITE_API_URL=http://localhost:5000/api/v1`

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 🧩 Core Components
- **Splitter.tsx**: The main recursive component that handles horizontal and vertical splitting logic.
- **Header.tsx**: Manages user authentication state and profile dropdown.
- **AuthContext.tsx**: Provides global user state and authentication methods.

## 📖 Key Logic
The screen splitting is handled using a recursive data structure where each node in the tree can be either a leaf (a pane) or a container (containing two child nodes and a split direction).
