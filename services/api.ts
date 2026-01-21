
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Booking, OpenMatch, UserProfile, Turf, Team, Notification } from '../lib/types';
import { MOCK_TURFS, MOCK_OPEN_MATCHES, MOCK_USER, MOCK_BOOKINGS, MOCK_TEAMS, MOCK_NOTIFICATIONS } from '../lib/mockData';

// Helper to simulate delay for mock mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    signInWithOtp: async (phone: string) => {
      if (!isSupabaseConfigured()) {
        await delay(1000);
        return { data: { user: MOCK_USER }, error: null };
      }
      return await supabase!.auth.signInWithOtp({ phone });
    },
    
    verifyOtp: async (phone: string, token: string) => {
      if (!isSupabaseConfigured()) {
        await delay(1000);
        return { data: { session: { user: MOCK_USER } }, error: null };
      }
      return await supabase!.auth.verifyOtp({ phone, token, type: 'sms' });
    },

    getProfile: async (userId: string) => {
      if (!isSupabaseConfigured()) {
        return { data: MOCK_USER, error: null };
      }
      const { data, error } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    },

    updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
        if (!isSupabaseConfigured()) return { error: null };
        return await supabase!.from('profiles').update(updates).eq('id', userId);
    }
  },

  data: {
    getTurfs: async () => {
      if (!isSupabaseConfigured()) return { data: MOCK_TURFS, error: null };
      return await supabase!.from('turfs').select('*');
    },

    getBookings: async (userId?: string) => {
      if (!isSupabaseConfigured()) return { data: [], error: null };
      let query = supabase!.from('bookings').select('*, turf:turfs(*)').order('start_time', { ascending: false });
      if (userId) query = query.eq('user_id', userId);
      return await query;
    },

    checkAvailability: async (turfId: string, date: string) => {
        if (!isSupabaseConfigured()) {
            // Mock logic: filter MOCK_BOOKINGS locally
            // Assume date is YYYY-MM-DD
            const booked = MOCK_BOOKINGS.filter(b => 
                b.turf_id === turfId && 
                b.start_time.startsWith(date) &&
                b.status !== 'CANCELLED'
            ).map(b => b.start_time);
            return { data: booked, error: null };
        }
        
        try {
            const res = await fetch(`/api/bookings/check-slot?turf_id=${turfId}&date=${date}`);
            if (res.ok) {
                const json = await res.json();
                // API returns { bookedSlots: [{ start_time: '...', status: '...' }] }
                return { data: json.bookedSlots.map((b: any) => b.start_time), error: null };
            }
            return { data: [], error: 'Failed to fetch slots' };
        } catch (e: any) {
            return { data: [], error: e.message };
        }
    },

    createBooking: async (booking: Booking) => {
      if (!isSupabaseConfigured()) return { data: booking, error: null };
      
      try {
          // Attempt to use the Next.js API Route first
          const response = await fetch('/api/bookings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(booking),
          });

          if (response.ok) {
              const data = await response.json();
              return { data, error: null };
          } else {
              const errData = await response.json().catch(() => ({ error: 'Unknown API error' }));
              
              if (response.status === 404) {
                  // Fallback for client-side insert if API route is missing (SPA mode)
                  const { turf, ...dbBooking } = booking;
                  return await supabase!.from('bookings').insert(dbBooking).select().single();
              }
              
              return { data: null, error: new Error(errData.error || response.statusText) };
          }
      } catch (e: any) {
          console.error('Create Booking Exception:', e);
          const { turf, ...dbBooking } = booking;
          return await supabase!.from('bookings').insert(dbBooking).select().single();
      }
    },

    cancelBooking: async (bookingId: string) => {
      if (!isSupabaseConfigured()) return { error: null };
      return await supabase!.from('bookings').update({ status: 'CANCELLED' }).eq('id', bookingId);
    },

    getOpenMatches: async () => {
        if (!isSupabaseConfigured()) return { data: MOCK_OPEN_MATCHES, error: null };
        return await supabase!.from('open_matches').select('*, turf:turfs(*)').order('start_time', { ascending: true });
    },

    createMatch: async (match: OpenMatch) => {
        if (!isSupabaseConfigured()) return { data: match, error: null };
        const { turf, host, ...dbMatch } = match;
        return await supabase!.from('open_matches').insert(dbMatch).select().single();
    },

    joinMatch: async (matchId: string, userId: string) => {
        if (!isSupabaseConfigured()) return { error: null };
        const { data: match } = await supabase!.from('open_matches').select('joined_players').eq('id', matchId).single();
        if (match) {
            const updatedPlayers = [...(match.joined_players || []), userId];
            return await supabase!.from('open_matches').update({ joined_players: updatedPlayers }).eq('id', matchId);
        }
        return { error: 'Match not found' };
    },

    updateMatch: async (matchId: string, updates: Partial<OpenMatch>) => {
        if (!isSupabaseConfigured()) return { error: null };
        // Exclude complex nested objects if necessary, but Supabase JSONB handles most
        const { turf, host, ...dbUpdates } = updates;
        return await supabase!.from('open_matches').update(dbUpdates).eq('id', matchId);
    },

    getTeams: async () => {
        if(!isSupabaseConfigured()) return { data: MOCK_TEAMS, error: null };
        return await supabase!.from('teams').select('*'); 
    }
  },

  payment: {
      createOrder: async (amount: number, receiptId: string) => {
          try {
              const res = await fetch('/api/payments/create-order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ amount, receipt: receiptId })
              });
              if(res.ok) return await res.json();
              throw new Error('Payment init failed');
          } catch(e) {
              console.error(e);
              return { id: `order_demo_${Date.now()}`, amount: amount * 100 };
          }
      },
      
      verifyPayment: async (paymentData: any) => {
          try {
              const res = await fetch('/api/payments/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(paymentData)
              });
              return await res.json();
          } catch(e) {
              return { success: true };
          }
      }
  }
};
