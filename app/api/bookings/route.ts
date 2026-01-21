
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Client with Service Role for Admin privileges (Bypasses RLS for availability checks)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { turf_id, start_time, end_time, user_id, price, sport, payment_mode } = body;

    if (!turf_id || !start_time || !user_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Transactional Availability Check
    // We check if any CONFIRMED booking exists for this turf at this time
    const { data: existingBooking, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .eq('turf_id', turf_id)
      .eq('start_time', start_time)
      .eq('status', 'CONFIRMED')
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "No rows found" which is good
        console.error('Availability check failed:', checkError);
        return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
    }

    if (existingBooking) {
      return NextResponse.json({ error: 'Slot is no longer available.' }, { status: 409 });
    }

    // 2. Create Booking
    const { data: newBooking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        turf_id,
        user_id,
        sport,
        start_time,
        end_time,
        price,
        payment_mode,
        status: payment_mode === 'ONLINE' ? 'PENDING_PAYMENT' : 'CONFIRMED', // If online, wait for webhook/verify
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Booking insertion failed:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json(newBooking);

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
