#!/bin/bash
echo "Starting deployment to Vercel..."
echo "Ensure you have your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ready if this is the first deployment."
npx vercel
