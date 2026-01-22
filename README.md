# LuxeCard - Premium Digital Identity Architecture

LuxeCard is an institutional-grade digital business card platform designed for high-trust professional networking. It features real-time analytics, dynamic "bento-grid" layouts, and seamless sharing via QR codes and deep links.

![LuxeCard Preview](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## Features

- **Real-Time Analytics**: Track views, link clicks, and engagement instantly via Supabase.
- **Dynamic Interface**: Glassmorphism and "Bento" grid layouts powered by Tailwind CSS and Framer Motion.
- **Identity Management**: Create, edit, and manage multiple professional identities.
- **Institutional Security**: Secure authentication and row-level security policies.
- **Smart Sharing**: Generate branded QR codes and unique username slugs.

## Technology Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Animations**: Framer Motion
- **Backend & Auth**: Supabase (PostgreSQL)

## Getting Started

### Prerequisites

- Node.js (v18+)
- A Supabase Project

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/luxecard.git
    cd luxecard
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

## Deployment

This project is optimized for deployment on **Vercel** or **Netlify*

## Project Structure

- `/src/pages`: Main application routes (Dashboard, Editor, Public Card).
- `/src/components`: Reusable UI components (CardPreview, Navbar).
- `/src/services`: Supabase integrations (`auth.ts`, `cards.ts`, `analytics.ts`).
- `/src/types`: TypeScript definitions for Cards and Users.


