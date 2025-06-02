import { useState, useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { useSupabase } from './useSupabase';
import toast from 'react-hot-toast';

type Hustle = Database['public']['Tables']['hustles']['Row'];

export function useRealtimeHustles(userId: string) {
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { getHustles } = useSupabase();

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchHustles = async () => {
      try {
        setLoading(true);
        const data = await getHustles(userId);
        setHustles(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch hustles'));
        toast.error('Failed to load hustles');
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
            switch (payload.eventType) {
              case 'INSERT':
                setHustles((current) => [payload.new as Hustle, ...current]);
                toast.success('New hustle added');
                break;
              case 'UPDATE':
                setHustles((current) =>
                  current.map((hustle) =>
                    hustle.id === payload.new.id ? (payload.new as Hustle) : hustle
                  )
                );
                toast.success('Hustle updated');
                break;
              case 'DELETE':
                setHustles((current) =>
                  current.filter((hustle) => hustle.id !== payload.old.id)
                );
                toast.success('Hustle removed');
                break;
            }
          }
        )
        .subscribe();
    };

    fetchHustles();
    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId, getHustles]);

  return { hustles, loading, error };
}