
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const turfId = searchParams.get('turf_id');
  const date = searchParams.get('date');

  if (!turfId || !date) {
    return NextResponse.json({ error: 'Missing turf_id or date' }, { status: 400 });
  }

  // Fetch all bookings for this turf on this date
  // Assuming start_time is ISO string, we filter by range
  const startOfDay = `${date}T00:00:00`;
  const endOfDay = `${date}T23:59:59`;

  const { data, error } = await supabase
    .from('bookings')
    .select('start_time, status')
    .eq('turf_id', turfId)
    .gte('start_time', startOfDay)
    .lte('start_time', endOfDay)
    .neq('status', 'CANCELLED');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookedSlots: data });
}
