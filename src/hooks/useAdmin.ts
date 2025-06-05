import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

interface AdminUser {
  user_id: string;
  role: 'admin' | 'moderator' | 'editor';
  permissions: string[];
  created_at: string;
  updated_at: string;
}

interface ContentUpdate {
  id: string;
  created_at: string;
  user_id: string;
  content_type: string;
  content_id: string;
  action: string;
  changes: any;
}

export function useAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setIsAdmin(!!data);
      return !!data;
    } catch (err) {
      console.error('Error checking admin status:', err);
      return false;
    }
  }, []);

  const getAdminUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      const error = err as Error;
      toast.error('Failed to fetch admin users');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addAdminUser = useCallback(async (userId: string, role: 'admin' | 'moderator' | 'editor' = 'editor') => {
    try {
      setLoading(true);
      const { error } = await supabase.rpc('add_admin', {
        admin_user_id: userId,
        admin_role: role
      });

      if (error) throw error;
      toast.success('Admin user added successfully');
    } catch (err) {
      const error = err as Error;
      toast.error('Failed to add admin user');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getContentUpdates = useCallback(async (options: {
    contentType?: string;
    limit?: number;
    offset?: number;
  } = {}) => {
    const { contentType, limit = 10, offset = 0 } = options;

    try {
      setLoading(true);
      let query = supabase
        .from('content_updates')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (err) {
      const error = err as Error;
      toast.error('Failed to fetch content updates');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTemplate = useCallback(async (id: string, updates: Partial<Database['public']['Tables']['templates']['Update']>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Template updated successfully');
      return data;
    } catch (err) {
      const error = err as Error;
      toast.error('Failed to update template');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateHustle = useCallback(async (id: string, updates: Partial<Database['public']['Tables']['hustles']['Update']>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hustles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Hustle updated successfully');
      return data;
    } catch (err) {
      const error = err as Error;
      toast.error('Failed to update hustle');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    isAdmin,
    checkAdminStatus,
    getAdminUsers,
    addAdminUser,
    getContentUpdates,
    updateTemplate,
    updateHustle,
  };
}