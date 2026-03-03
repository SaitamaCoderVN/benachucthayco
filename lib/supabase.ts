import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const isValidUrl = supabaseUrl?.startsWith('http');

// Initialize conditionally to prevent crashing if the user hasn't added .env credentials yet
export const supabase = isValidUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
