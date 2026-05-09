import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    console.log('[Student Materials] Fetching from Supabase...');

    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Student Materials] Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('[Student Materials] Fetched', data?.length || 0, 'materials');

    // Map to the format the student downloads page expects
    const materials = (data || []).map((m: any) => ({
      id: String(m.id),
      title: m.title || 'Untitled',
      description: m.description || '',
      subject: m.subject || 'General',
      teacherName: m.uploaded_by || 'Teacher',
      uploadDate: m.created_at,
      type: m.file_type || 'pdf',
      size: m.file_size || '—',
      url: m.file_url || null,
      offline: false,
    }));

    return NextResponse.json(materials);
  } catch (error) {
    console.error('[Student Materials] Server error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}
