# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a card memory game built with React 19, TypeScript, Vite, and Tailwind CSS v4. The project uses the modern Vite build tooling with HMR (Hot Module Replacement) for fast development.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Run ESLint
npm run lint

# Build for production (TypeScript compilation + Vite build)
npm run build

# Preview production build locally
npm run preview
```

## Technology Stack

- **React 19.1.1** - Latest React with modern features
- **TypeScript 5.8.3** - Strict typing enabled
- **Vite 7.1.7** - Build tool with fast HMR
- **Tailwind CSS 4.1.13** - Utility-first CSS framework (v4 with Vite plugin)
- **ESLint 9** - Flat config format with React Hooks and TypeScript rules

## Project Structure

```
src/
  main.tsx          - Application entry point with React.StrictMode
  App.tsx           - Main App component
  App.css           - App-specific styles
  index.css         - Global styles (includes Tailwind)
  assets/           - Static assets (images, icons)
```

## Tailwind CSS v4 Integration

This project uses Tailwind CSS v4 with the Vite plugin (`@tailwindcss/vite`). The CSS is imported in `src/index.css`. When working with styles:
- Use Tailwind utility classes in JSX
- Tailwind v4 uses native CSS features and has different configuration than v3
- The Vite plugin handles compilation automatically

## TypeScript Configuration

The project uses TypeScript project references with two config files:
- `tsconfig.app.json` - Application code configuration
- `tsconfig.node.json` - Vite/Node tooling configuration
- `tsconfig.json` - Root config that references both

## ESLint Configuration

Uses flat config format (`eslint.config.js`) with:
- TypeScript ESLint recommended rules
- React Hooks recommended rules
- React Refresh plugin for Vite HMR
- Ignores `dist/` directory
- Targets browser environment

## Build Process

The `npm run build` command:
1. Runs TypeScript compiler in build mode (`tsc -b`)
2. Runs Vite build for optimized production bundle
3. Outputs to `dist/` directory

Both steps must complete successfully for production deployment.
