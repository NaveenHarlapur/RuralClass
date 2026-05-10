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
GRANT SELECT, INSERT ON assignments TO anon;
GRANT SELECT, INSERT ON assignments TO authenticated;

-- 6. Create study_materials table
CREATE TABLE IF NOT EXISTS public.study_materials (
  id bigint generated always as identity primary key,
  title text not null,
  subject text,
  description text,
  file_url text not null,
  file_name text,
  teacher_name text,
  created_at timestamp with time zone default now()
);

-- 7. Disable RLS on study_materials for public access
ALTER TABLE public.study_materials DISABLE ROW LEVEL SECURITY;

-- 8. Setup Storage Policies for 'study-materials' bucket
-- NOTE: The bucket 'study-materials' must be created in the Supabase Dashboard first.
-- These policies allow anyone to upload/view/delete for testing purposes.

create policy "Allow all uploads"
on storage.objects
for insert
to public
with check (bucket_id = 'study-materials');

create policy "Allow all selects"
on storage.objects
for select
to public
using (bucket_id = 'study-materials');

create policy "Allow all updates"
on storage.objects
for update
to public
using (bucket_id = 'study-materials');

create policy "Allow all deletes"
on storage.objects
for delete
to public
using (bucket_id = 'study-materials');

-- 9. Create attendance table
create table if not exists public.attendance (
  id bigint generated always as identity primary key,
  student_email text not null,
  student_name text not null,
  status text not null,
  attendance_date date not null,
  created_at timestamp with time zone default now()
);

-- 10. Disable RLS on attendance for public access
alter table public.attendance disable row level security;
