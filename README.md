# NextUp — Your Bucket List, Reimagined

A beautifully simple bucket list app designed to help you capture your wildest ambitions, organize them into lists, and track your progress as you achieve your dreams.

## About the Project

**NextUp** is a modern, full-stack web application built with React and Firebase. It allows users to:

- **Capture everything**: Add goals in seconds without losing a single idea
- **Organize into lists**: Create separate bucket lists for Travel, Career, Fitness, and more
- **Track progress**: Check off achievements and watch your progress bar fill up
- **Sign in securely**: Authenticate via Google and sync across devices

### Key Features

- 🎨 **Beautiful UI**: Clean, modern design inspired by Apple's design language
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🔐 **Secure authentication**: Firebase Google Sign-In
- ☁️ **Cloud-based storage**: All data synced via Firestore in real-time
- ✅ **Progress tracking**: Visual progress indicators for each list
- 🎯 **Intuitive UX**: Smooth animations and interactions

## Project Directory Structure

```
nextup/
├── index.html                 # Entry point
├── package.json              # Dependencies & scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── eslint.config.js          # ESLint configuration
│
├── src/
│   ├── main.jsx              # React app entry
│   ├── App.jsx               # Main app component (routing)
│   ├── index.css             # Global styles & animations
│   ├── firebase.js           # Firebase configuration
│   │
│   └── pages/
│       ├── LandingPage.jsx   # Marketing landing page
│       ├── SignIn.jsx        # Google authentication page
│       └── Dashboard.jsx     # Main app (lists & items)
```


## Setup and Installation


### Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- React 19
- Firebase 12
- Tailwind CSS 4
- Vite (build tool)
- ESLint (linting)

### Step 2: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Google Authentication** in Authentication settings
4. Create a **Firestore Database** in production mode
5. Copy your Firebase config credentials

### Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace with your actual Firebase credentials from the Firebase Console.

### Step 4: Run Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173` (or another port if 5173 is in use).



## How the App Works

### User Flow

```
Landing Page → Sign In (Google) → Dashboard
```

### 1. **Landing Page**
- Showcases features with attractive cards
- Stats display (trips planned, goals achieved, lists created)
- CTA buttons to get started
- Fully responsive design

### 2. **Sign In**
- Google OAuth popup authentication
- First-time users: profile created in Firestore
- Returning users: existing data loaded automatically
- Error handling for auth failures

### 3. **Dashboard**

#### **Sidebar (Left Panel)**
- **NextUp logo** with branding
- **"New Bucket List"** button
- **List navigation** — shows all user's lists
- **User profile section** — avatar, name, email
- **Sign Out** button

#### **Main Content Area**
- **List header** with name and progress indicator
  - Circular progress chart (0-100%)
  - Item count (e.g., "3 of 5 completed")
  - Delete list button
  
- **Add item input** — quick input to add new goals
  
- **Items list** displaying all bucket list items
  - **Checkbox** — toggle complete/incomplete status
  - **Text** — item description (strikethrough when completed)
  - **Delete button** — remove item (appears on hover)

#### **Responsive Behavior**
- **Desktop** (≥768px): Sidebar always visible, full layout
- **Mobile** (<768px): 
  - Hamburger menu to toggle sidebar drawer
  - Plus button in top nav to add lists
  - Touch-friendly spacing and buttons

### 4. **Real-Time Sync**
- All changes sync instantly via Firestore
- Add a list → appears in sidebar immediately
- Add item → appears in list instantly
- Mark complete → progress bar updates in real-time
- Delete → removed across all views instantly




---

**Built with ❤️ for bucket list dreamers everywhere.**
