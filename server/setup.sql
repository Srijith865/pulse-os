-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name text NOT NULL,
  uploaded_at timestamp with time zone DEFAULT now(),
  entities jsonb NOT NULL,
  user_id uuid -- Optional: link to your users table if needed
);

-- Disable RLS for testing purposes so you can insert data without complex policies
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
