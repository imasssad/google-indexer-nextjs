/**
 * Supabase client configuration
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface IndexingHistory {
  id?: number;
  url: string;
  status: 'success' | 'failed';
  methods_used: any[];
  timestamp: string;
  created_at?: string;
}
