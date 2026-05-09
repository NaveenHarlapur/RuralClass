import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getTeacherName(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { name: true, role: true },
  });

  if (!user || user.role !== 'teacher') return null;
  return user.name;
}

// GET: Fetch all materials from Supabase
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('GET materials error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET materials catch:', error);
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 });
  }
}

// POST: Upload file to Supabase Storage + save metadata
export async function POST(req: Request) {
  try {
    const teacherName = await getTeacherName();
    if (!teacherName) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as string || 'published';

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    let fileUrl = '';
    let fileName = '';
    let fileType = 'none';
    let fileSize = '—';

    if (file && file.size > 0) {
      fileName = file.name;
      fileType = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      fileSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`;

      // Create unique file path
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${timestamp}_${safeName}`;

      console.log('[Upload] Uploading file to Supabase Storage:', filePath);

      // Convert File to ArrayBuffer for upload
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('study-materials')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('[Upload] Storage upload error:', uploadError);
        return NextResponse.json(
          { error: 'File upload failed: ' + uploadError.message },
          { status: 500 }
        );
      }

      console.log('[Upload] File uploaded successfully:', uploadData.path);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('study-materials')
        .getPublicUrl(uploadData.path);

      fileUrl = urlData.publicUrl;
      console.log('[Upload] Public URL:', fileUrl);
    }

    // Save metadata to Supabase materials table
    const { data: material, error: insertError } = await supabase
      .from('materials')
      .insert([
        {
          title,
          subject: subject || 'General',
          description: description || '',
          file_name: fileName,
          file_url: fileUrl,
          file_type: fileType,
          file_size: fileSize,
          uploaded_by: teacherName,
          status,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('[Upload] Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save material: ' + insertError.message },
        { status: 500 }
      );
    }

    console.log('[Upload] Material saved:', material.id, material.title);

    return NextResponse.json({
      success: true,
      material,
    });
  } catch (error) {
    console.error('[Upload] Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
