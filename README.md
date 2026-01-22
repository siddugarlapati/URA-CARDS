# LuxeCard - Premium Digital Identity Architecture

LuxeCard is an institutional-grade digital business card platform designed for high-trust professional networking. It features real-time analytics, dynamic "bento-grid" layouts, and seamless sharing via QR codes and deep links.



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

### Deploy with Vercel (Recommended)

The easiest way to deploy is using the Vercel CLI.

1.  **Install Vercel CLI** (optional, you can use `npx`):
    ```bash
    npm i -g vercel
    ```

2.  **Deploy**:
    Run the deploy script (or `npx vercel`):
    ```bash
    ./deploy.sh
    ```
    OR
    ```bash
    npx vercel
    ```

3.  **Follow the Prompts**:
    - Set up and deploy: `Y`
    - Which scope: `(Select your account)`
    - Link to existing project: `N` (unless you have one)
    - Project Name: `luxecard` (or your preference)
    - In which directory is your code located: `./` (default)
    - Want to modify these settings: `N` (Auto-detected Vite settings are usually correct)

4.  **Environment Variables**:
    **IMPORTANT**: Vercel will ask if you want to set up environment variables. Select `N` for the first run if you want to set them in the dashboard, OR select `Y` to input them now.
    
    You MUST set the actual values for:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`

    You can allow Vercel to pull these from your local `.env.local` if you choose `Y`.

### Manual Dashboard Deployment
1.  Push your code to GitHub.
2.  Import the project in [Vercel Dashboard](https://vercel.com/new).
3.  Add the Environment Variables in the project settings.
4.  Deploy.

## Project Structure

- `/src/pages`: Main application routes (Dashboard, Editor, Public Card).
- `/src/components`: Reusable UI components (CardPreview, Navbar).
- `/src/services`: Supabase integrations (`auth.ts`, `cards.ts`, `analytics.ts`).
- `/src/types`: TypeScript definitions for Cards and Users.


