# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a modern football lineup builder application built with Next.js 14, TypeScript, and Tailwind CSS. The application allows users to create visual football team formations with drag-and-drop functionality.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Database**: SQLite with Prisma ORM
- **Image Export**: html2canvas

## Key Features
- Visual football pitch with realistic design
- Drag-and-drop player positioning
- Multiple formation support (4-4-2, 4-3-3, 3-5-2, etc.)
- Player search and filtering
- Dark theme with green-black color scheme
- Image export functionality
- User management system
- Offline functionality

## Code Style Guidelines
- Use TypeScript strict mode
- Follow Next.js 14 App Router conventions
- Use Tailwind CSS utility classes
- Implement responsive design with mobile-first approach
- Use Zustand for global state management
- Leverage Framer Motion for smooth animations
- Follow component composition patterns
- Use proper TypeScript interfaces and types

## Database Schema
- Users table for authentication
- Players table for football player data
- Lineups table for saved formations
- Teams table for team information
- Leagues table for league data

## API Integration
- Football-Data.org API for real player data
- Local SQLite database for offline functionality
- RESTful API endpoints for CRUD operations

## Performance Considerations
- Use Next.js Image component for optimized images
- Implement lazy loading for player lists
- Optimize drag-and-drop performance
- Use React.memo for player cards
- Implement proper error boundaries
