# aeromagasia-website

A modern web application for Aeromag Asia, built with Next.js and optimized for performance.

# Tech Stack

* Node.js: 20.x (Recommended)
* Next.js: 16.1.6
* React: 19.2.4
* TypeScript: 5.9.3
* Tailwind CSS: 4.1.18
* Bun: (Used for scripts)
* State Management: Zustand

# Setup

Install dependencies

```bash
bun install
```

Run development server

```bash
bun dev
```

Build

```bash
bun build
```

Start production

```bash
bun start
```

# Project Structure

* `app/` – Next.js App Router, pages, and API routes
* `components/` – Reusable UI components (Radix UI, Lucide)
* `hooks/` – Custom React hooks
* `lib/` – Utility functions and shared libraries
* `store/` – State management stores (Zustand)
* `public/` – Static assets

# State Management

* State Management: Zustand
* Location: `store/`

# Environment Variables

* `NEXT_PUBLIC_BASE_URL` – Base URL for the application
* `NEXT_PUBLIC_APP_URL` – Application URL
* `NEXT_PUBLIC_API_BASE_URL` – Backend API base URL
* `API_USERNAME` – API authentication username
* `API_PASSWORD` – API authentication password

# API

* REST API integration
* Base URL configured via `NEXT_PUBLIC_API_BASE_URL`
* Utilities located in `lib/` and shared stores

# Deployment

Deployment is managed on a **VPS using PM2**.

```bash
bun run build
pm2 start npm --name aeromag-website -- start
```

PM2 handles process management, load balancing, and automatic restarts on failure.

# Notes

* Uses **Biome** for formatting and linting (`bun format`).
* Integrated with **TanStack Query** for data fetching and caching.
* Built with **Tailwind CSS v4** for styling.
