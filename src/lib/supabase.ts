import { createClient } from "@supabase/supabase-js";

const supabaseUrl =  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://njkdtjgciebwytrbblbt.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qa2R0amdjaWVid3l0cmJibGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNzQxMzEsImV4cCI6MjA1NTY1MDEzMX0.DIrObIIxxqpLZqnocdEmXRGN5xB2oAM5AxThU0SxDZ8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey,{
    auth: {
        persistSession: true,
        autoRefreshToken: true, 
        detectSessionInUrl: true,
      },
});


