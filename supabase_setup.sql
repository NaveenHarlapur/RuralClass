-- Run this SQL in your Supabase Dashboard → SQL Editor
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor → New Query

-- 1. Create the assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  subject TEXT DEFAULT 'General',
  due_date DATE NOT NULL,
  teacher_name TEXT DEFAULT 'Teacher',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- 3. Allow everyone to read assignments (students can view)
CREATE POLICY "Anyone can read assignments"
  ON assignments
  FOR SELECT
  USING (true);

-- 4. Allow everyone to insert assignments (teacher inserts via API)
CREATE POLICY "Anyone can insert assignments"
  ON assignments
  FOR INSERT
  WITH CHECK (true);

-- 5. Grant access to anon and authenticated roles
GRANT SELECT, INSERT ON assignments TO anon;
GRANT SELECT, INSERT ON assignments TO authenticated;
