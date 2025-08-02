# NeuroForge - AI Content Automation Platform

## Overview

NeuroForge is a comprehensive SaaS platform for AI-powered content automation, specifically designed for creating viral TikTok videos, professional VSLs (Video Sales Letters), and other marketing content. The platform leverages multiple AI services to provide an end-to-end content creation pipeline, from initial prompt analysis to final video delivery.

The system features a Google-style search interface with dynamic action buttons for different content types, real-time processing status tracking, and user project history management. Built as a modern full-stack application with React frontend and Express backend, it integrates with various AI services including Gemini for analysis, Claude for script generation, MiniMax for video creation, and Whisper for audio processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with **React 18** and **TypeScript**, utilizing modern React patterns including hooks and functional components. The UI framework leverages **shadcn/ui** components built on top of **Radix UI** primitives, providing accessible and customizable interface elements. **TailwindCSS** handles styling with a custom design system featuring glassmorphism effects, animated backgrounds, and responsive layouts.

State management is handled through **TanStack React Query** for server state synchronization and caching, while local component state uses React's built-in state management. The routing system uses **Wouter** for lightweight client-side navigation.

### Backend Architecture
The server implementation uses **Express.js** with TypeScript in ESM module format. The architecture follows a layered approach with clear separation between routes, services, and storage layers. Session management is implemented using **express-session** with configurable storage options.

The AI processing pipeline is encapsulated in a dedicated service layer that orchestrates multiple AI API calls sequentially. The storage layer uses an abstraction pattern with in-memory implementation for development and extensibility for database integration.

### Authentication System
User authentication is implemented using session-based authentication with **bcrypt** for password hashing. The system supports user registration and login with email/password credentials, maintaining user sessions across requests. User data is isolated per account with project-specific access controls.

### AI Integration Pipeline
The core functionality revolves around a multi-step AI processing pipeline:

1. **Analysis Phase**: Uses Google's Gemini AI for initial prompt analysis and content understanding
2. **Script Generation**: Leverages Claude via OpenRouter API for creating optimized scripts and roteiros
3. **Video Creation**: Integrates with MiniMax API for video generation based on scripts
4. **Audio Processing**: Utilizes OpenAI's Whisper for audio transcription and voice generation
5. **Asset Storage**: All generated content is stored using Cloudinary for reliable media delivery

The pipeline includes fallback mechanisms and error handling to ensure graceful degradation when individual services are unavailable.

### Database Schema
The data model is defined using **Drizzle ORM** with PostgreSQL dialect, featuring:

- **Users table**: Stores user authentication data (id, email, hashed password, creation timestamp)
- **Projects table**: Contains project metadata (id, user_id, type, prompt, status, asset links, metadata, timestamps)

The schema supports extensible project types and JSON metadata storage for flexible data requirements.

### UI/UX Design Patterns
The interface implements a modern design system with:

- **Glassmorphism effects**: Semi-transparent elements with backdrop blur for depth
- **Animated background**: Floating orbs with CSS animations for visual appeal  
- **Dynamic action buttons**: Contextual content type selectors with hover effects
- **Real-time status modals**: Step-by-step processing visualization with progress indicators
- **Responsive design**: Mobile-first approach with adaptive layouts

## External Dependencies

### AI Services
- **Google Gemini AI**: Content analysis and prompt understanding via @google/genai SDK
- **OpenRouter/Claude**: Advanced script generation for marketing content
- **MiniMax API**: Video generation and visual content creation
- **OpenAI Whisper**: Audio transcription and voice synthesis

### Cloud Storage
- **Cloudinary**: Media asset storage and delivery with automatic optimization and CDN distribution

### Database
- **PostgreSQL**: Primary data storage via Neon Database (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database operations with schema management

### Development Tools
- **Vite**: Frontend build tool with hot module replacement and optimized production builds
- **ESBuild**: Backend bundling for production deployment
- **TypeScript**: Type safety across the entire stack

### UI Components
- **Radix UI**: Accessible component primitives for complex UI patterns
- **TailwindCSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Consistent icon system throughout the application

### Authentication & Security
- **bcrypt**: Password hashing for secure credential storage
- **express-session**: Server-side session management with configurable stores