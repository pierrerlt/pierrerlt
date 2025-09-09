# FileHoster - Professional File Hosting Application

A modern file hosting application with Discord integration, built with Next.js, React, and TypeScript.

## Features

- 🔐 **Secure File Hosting**: End-to-end encryption for all files
- ⚡ **Fast Performance**: Lightning-fast uploads and downloads
- 🎮 **Discord Integration**: Seamless login with Discord OAuth
- 🌍 **Multi-language Support**: German and English translations
- 🎨 **Dark/Light Theme**: Modern UI with theme switching
- 📊 **Real-time Statistics**: Animated counters for file stats
- 🛡️ **DevTools Protection**: Security measures against inspection

## Components Overview

### Main Components
- **MainPage**: Landing page with hero section, features, and statistics
- **AuthProvider**: Authentication context with Discord OAuth integration
- **LanguageProvider**: Internationalization with German/English support
- **DevToolsProtection**: Security component to prevent dev tools access

### UI Components
- **Button**: Customizable button component with variants
- **Badge**: Status badges with different styles
- **Card**: Container components for content sections
- **LanguageToggle**: Switch between German and English
- **ThemeToggle**: Toggle between light and dark themes

## File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── card.tsx
│   ├── MainPage.tsx
│   ├── LanguageToggle.tsx
│   ├── ThemeToggle.tsx
│   └── DevToolsProtection.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx
└── lib/
    └── utils.ts
```

## Key Features Explained

### Authentication System
- Discord OAuth integration
- Session management
- User approval workflow
- Automatic session updates for approved users

### Internationalization
- Complete German and English translations
- Browser language detection
- Persistent language preference
- Easy translation key system

### Security Features
- DevTools detection and blocking
- Function constructor override to prevent debugging
- Keyboard shortcut prevention
- Access denial screen with dramatic styling

### Statistics Animation
- Smooth counter animations using requestAnimationFrame
- Storage size formatting (B, KB, MB, GB)
- Real-time data fetching from API
- Performance-optimized animations

### Modern UI/UX
- Gradient backgrounds and modern styling
- Responsive grid layouts
- Hover effects and transitions
- Icon integration with Lucide React
- Card-based feature presentation

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **React 18**: Modern React with hooks and context
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Radix UI**: Accessible UI primitives
- **Class Variance Authority**: Type-safe styling variants

## API Endpoints

- `GET /api/global` - Fetch global statistics
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/session` - Update user session
- `/api/auth/discord` - Discord OAuth login

This application represents a modern, secure file hosting solution with professional-grade features and a polished user experience.