import { useState, useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Hustle = Database['public']['Tables']['hustles']['Row'];

export function useRealtimeHustles(userId: string) {
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    const fetchHustles = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('hustles')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setHustles(data || []);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch hustles');
        setError(error);
        console.error('Error fetching hustles:', error);
      } finally {
        setLoading(false);
      }
    };

    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel(`hustles:${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'hustles',
            filter: `user_id=eq.${userId}`,
          },
          async (payload) => {
            console.log('Real-time update:', payload);
            
            switch (payload.eventType) {
              case 'INSERT':
                setHustles((current) => [payload.new as Hustle, ...current]);
                break;
              case 'UPDATE':
                setHustles((current) =>
                  current.map((hustle) =>
                    hustle.id === payload.new.id ? (payload.new as Hustle) : hustle
                  )
                );
                break;
              case 'DELETE':
                setHustles((current) =>
                  current.filter((hustle) => hustle.id !== payload.old.id)
                );
                break;
            }
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });
    };

    fetchHustles();
    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('hustles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setHustles(data || []);
    } catch (err) {
      console.error('Error refetching hustles:', err);
    } finally {
      setLoading(false);
    }
  };

  return { hustles, loading, error, refetch };
}