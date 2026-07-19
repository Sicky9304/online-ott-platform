# 🎬 CINEVERSE | Enterprise Premium OTT Streaming Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2026-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

An enterprise-grade, luxury cinematic OTT streaming platform inspired by Netflix, Apple TV+, Disney+, and Max. Features a custom ultra-dark glassmorphism design system, Three.js 3D backdrops, mouse spotlight tracking, multi-provider `StorageService` abstraction (Google Drive, Mega.nz, Cloudinary), custom 4K video player, and a comprehensive Admin Studio.

---

## 📋 Table of Contents

- [✨ Features](#-features)
  - [Frontend & UI/UX](#frontend--uiux)
  - [Video Player](#video-player)
  - [Storage System Architecture](#storage-system-architecture)
  - [Backend & Security](#backend--security)
  - [Admin Panel & Operations](#admin-panel--operations)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Architecture & Directory Structure](#-architecture--directory-structure)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Getting Started](#-getting-started)
- [🔒 StorageService API Documentation](#-storageservice-api-documentation)
- [🎨 Design System](#-design-system)
- [📄 License](#-license)

---

## ✨ Features

### Frontend & UI/UX
- **Cinematic Dark Theme & Glassmorphism**: High-contrast luxury design with frosted glass cards, dynamic ambient neon gradients, and depth layers.
- **Interactive 3D Elements & Aurora Backgrounds**: Particle galaxy effects powered by Three.js / React Three Fiber, mouse-following cursor glow, and Framer Motion floating elements.
- **Hero Trailer Slideshow**: 12-movie auto-rotating hero spotlight with custom `"Watch Movie"` (requires login) and red mixed-gradient `"Showing Trailer"` controls. Plays youtube trailers with autoplay audio enabled by default.
- **3D Tilt Movie Cards**: Interactive hover elevation with live video trailer preview, watchlist status indicator, and dynamic login checks (redirects guest users to `/login`).
- **Dynamic Shuffled Shelves**: Shuffles Bollywood, Hollywood (Hindi Dubbed), South, Korean, and Bhojpuri content on every page load.
- **Multi-Filter Instant Search & Tags**: Instant search page with custom `🌐 All` filter chips matching Hindi, South, Korean, and Bhojpuri categories.
- **Responsive Layouts**: Pixel-perfect support across Mobile, Tablet, Laptop, Desktop, and Ultra-Wide displays.

### Video Player & Streaming Integration
- **Hybrid Source Playback**: Seamless support for local/cloud custom player streaming and embedded YouTube full-movie players.
- **Watch Progress Synchronization**: Auto-saves playback timestamp to backend database every 5 seconds for seamless continue watching across devices.

### Storage & Trailer Sync System
- **6-Hour Trailer Auto-Sync**: Automatically queries TMDB every 6 hours to fetch the latest trailers, adds up to 10 fresh trailers, and auto-deletes the oldest 10 trailers to keep database storage footprint constant.
- **Multi-Provider Storage Abstraction (`StorageService`)**:
  - Dynamic runtime switching without restarting or changing code.
  - Primary Providers: **Google Drive API**, **Mega.nz API**, **Local Fallback Storage**.
  - Image Storage: **Cloudinary API**.

### Backend & Security
- **RESTful Express API**: Modular controllers, routes, and services with Mongoose data modeling.
- **Authentication**: JWT token authentication, bcrypt password hashing, login redirects, and automatic home page redirection on login/logout states.
- **Security Protections**: Rate limiting, Helmet HTTP headers, CORS origin white-listing, input sanitization against XSS and SQL/NoSQL injection.

### Admin Panel & Operations
- **Executive Analytics Dashboard**: Streaming bandwidth metrics, total view counts, active subscriptions, and catalog size breakdown.
- **Media Content Manager**: CRUD management for Movies, TV Series, Seasons, Episodes, Categories, and Genres.
- **Hero Slider Studio**: Real-time management of home page spotlight movies, feature banners, and curated collections.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Role |
| :--- | :--- |
| **Next.js 16 (App Router)** | Framework & Server-Side Rendering |
| **React 19** | Component Architecture |
| **JavaScript (ES2026)** | Pure JS Implementation (No TypeScript) |
| **Tailwind CSS v4** | Modern Utility-First Styling System |
| **Framer Motion** | UI Micro-Animations & Page Transitions |
| **GSAP & ScrollTrigger** | Advanced Cinematic Timeline Animations |
| **Three.js & React Three Fiber** | 3D Interactive Canvas & Aurora Visuals |
| **Lucide React** | Premium Iconography |
| **TanStack Query (React Query)** | Server State Synchronization & Caching |
| **Axios** | HTTP API Client |

### Backend
| Technology | Role |
| :--- | :--- |
| **Node.js** | JavaScript Runtime Environment |
| **Express.js** | Web Framework for REST API |
| **MongoDB & Mongoose** | NoSQL Database & Data Modeling |
| **Redis** | In-Memory Data Caching & Session Store |
| **JWT (JsonWebToken)** | Stateless User Authentication |
| **bcryptjs** | Password Hashing |
| **Nodemailer** | Transactional Mail Dispatcher |

---

## 📂 Architecture & Directory Structure

```
online-ott-platform/
├── README.md                      # Complete Project Overview & Documentation
├── server/                        # Express Backend API Server
│   ├── config/                    # DB, Redis & Provider Configs
│   │   ├── db.js
│   │   ├── redis.js
│   │   └── storage.js
│   ├── controllers/               # Auth, Movie, Series, Admin & Storage Controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── seriesController.js
│   │   ├── storageController.js
│   │   └── userController.js
│   ├── middleware/                # Auth, Role, Security & Error Middleware
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/                    # Mongoose Data Schemas
│   │   ├── Category.js
│   │   ├── Comment.js
│   │   ├── Episode.js
│   │   ├── Genre.js
│   │   ├── Movie.js
│   │   ├── Review.js
│   │   ├── Series.js
│   │   ├── StorageConfig.js
│   │   ├── User.js
│   │   └── WatchHistory.js
│   ├── routes/                    # Express API Router Declarations
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── seriesRoutes.js
│   │   ├── storageRoutes.js
│   │   └── userRoutes.js
│   ├── services/                  # Multi-Provider Storage Services Architecture
│   │   ├── CloudinaryProvider.js
│   │   ├── GoogleDriveProvider.js
│   │   ├── LocalStorageProvider.js
│   │   ├── MegaProvider.js
│   │   ├── StorageService.js
│   │   └── VideoMetadataService.js
│   ├── utils/                     # Email, Logger & Response Helpers
│   │   ├── logger.js
│   │   └── responseHandler.js
│   ├── server.js                  # Entry point for backend API
│   └── package.json
│
└── client/                        # Next.js 16 Web Application
    ├── app/                       # App Router Pages & API Proxies
    │   ├── admin/                 # Admin Studio Pages
    │   │   ├── movies/
    │   │   ├── page.jsx
    │   │   ├── series/
    │   │   ├── storage/
    │   │   └── upload/
    │   ├── auth/                  # Authentication Pages
    │   │   ├── forgot-password/
    │   │   ├── login/
    │   │   ├── register/
    │   │   └── reset-password/
    │   ├── movie/[id]/            # Movie Detail Page
    │   ├── profile/               # User Account & Watchlist Page
    │   ├── search/                # Filtered Search Page
    │   ├── tv/[id]/               # TV Series Detail Page
    │   ├── watch/[id]/            # Custom 4K Player Page
    │   ├── globals.css            # Tailwind CSS v4 & Luxury Glass Styles
    │   ├── layout.jsx             # Main Glass App Layout
    │   ├── page.jsx               # Hero, Spotlight & Media Rows Home Page
    │   ├── robots.js              # Dynamic Robots Configuration
    │   └── sitemap.js             # Dynamic XML Sitemap Generator
    ├── components/                # Reusable Luxury Components
    │   ├── cinematic/             # Hero Slider, 3D Canvas, Aurora & Movie Cards
    │   │   ├── AuroraBackground.jsx
    │   │   ├── HeroSlider.jsx
    │   │   ├── MouseSpotlight.jsx
    │   │   ├── MovieCard3D.jsx
    │   │   ├── MovieRow.jsx
    │   │   └── ParticleCanvas.jsx
    │   ├── layout/                # Navigation Bar & Footer
    │   │   ├── Footer.jsx
    │   │   └── GlassNavbar.jsx
    │   ├── player/                # Custom Video Player Engine
    │   │   └── CustomVideoPlayer.jsx
    │   ├── search/                # Instant Filter Modal
    │   │   └── SearchFilters.jsx
    │   └── ui/                    # Glassmorphism UI Primitives
    │       ├── Button.jsx
    │       ├── GlassCard.jsx
    │       ├── Input.jsx
    │       ├── Modal.jsx
    │       └── Select.jsx
    ├── hooks/                     # Custom Hooks
    │   ├── useAuth.js
    │   ├── useMousePosition.js
    │   └── useWatchProgress.js
    ├── lib/                       # Utilities & Clients
    │   ├── api.js
    │   ├── queryClient.js
    │   └── utils.js
    ├── services/                  # Frontend API Connectors
    │   ├── authService.js
    │   ├── movieService.js
    │   └── storageService.js
    ├── next.config.mjs
    └── package.json
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
# Server Port & Mode
PORT=5000
NODE_ENV=development

# Database & Cache URIs
MONGO_URI=mongodb://127.0.0.1:27017/cineverse
REDIS_URL=redis://127.0.0.1:6379

# Authentication Secrets
JWT_SECRET=super_secret_jwt_key_cineverse_2026
JWT_EXPIRE=7d

# Active Storage Provider ('local', 'gdrive', 'mega')
ACTIVE_STORAGE_PROVIDER=local

# Google Drive API Configuration
GOOGLE_CLIENT_ID=your_gdrive_client_id_here
GOOGLE_CLIENT_SECRET=your_gdrive_client_secret_here
GOOGLE_REFRESH_TOKEN=your_gdrive_refresh_token_here
GOOGLE_DRIVE_FOLDER_ID=your_gdrive_folder_id_here

# Mega.nz API Configuration
MEGA_EMAIL=your_mega_email@example.com
MEGA_PASSWORD=your_mega_password_here

# Cloudinary Configuration (Images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

### Frontend (`client/.env.local`)
```env
# Node.js Express Backend API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Public App Metadata
NEXT_PUBLIC_APP_NAME=CineVerse
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Client-Side Google OAuth Login Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.x or later
- **MongoDB**: v6.0+ running locally or Mongo Atlas instance
- **Redis**: Running instance for caching (Optional: app gracefully handles local fallback if Redis is unavailable)

### 1. Clone & Setup Backend
```bash
cd server
npm install
npm run dev
```
The backend API server will start at `http://localhost:5000`.

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
```
The Next.js web application will open at `http://localhost:3000`.

---

## 🔒 StorageService API Documentation

The backend incorporates a unified `StorageService` pattern that decouples video file operations from underlying cloud providers.

```javascript
class StorageService {
  async upload(fileStream, options)     // Handles chunked stream upload with progress callback
  async delete(providerFileId)          // Deletes file from currently active provider
  async stream(providerFileId, range)   // Resolves HTTP 206 Partial Content video stream URL
  async rename(providerFileId, name)    // Renames file resource in provider folder
  async move(providerFileId, folderId)  // Relocates file resource to target directory
  async thumbnail(providerFileId)       // Triggers auto thumbnail extraction
  async getMetadata(providerFileId)     // Returns duration, codec, resolution, and dimensions
}
```

---

## 🎨 Design System

CineVerse utilizes a bespoke luxury dark design token system defined in CSS custom properties and Tailwind CSS v4 directives:

- **Deep Space Background**: `#050508`
- **Glass Panel Surface**: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(24px)`
- **Neon Cyan Accent**: `#06B6D4` / `hsl(188, 94%, 43%)`
- **Electric Violet Accent**: `#8B5CF6` / `hsl(262, 83%, 58%)`
- **Gold Badge Accent**: `#EAB308` / `hsl(48, 96%, 53%)`
- **Typography**: Clean sans-serif hierarchy with tracking for cinematic headings and metadata tags.

---

## 📄 License

This software is developed strictly for personal and legally owned media distribution. All code rights reserved.
