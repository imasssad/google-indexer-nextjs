/**
 * Supabase-based storage for indexing history
 */

import { supabase } from './supabase';

interface StoredIndexResult {
  url: string;
  status: 'success' | 'failed';
  methods_used: any[];
  timestamp: string;
}

/**
 * Read indexing history from Supabase
 */
export async function readHistory(limit = 1000): Promise<StoredIndexResult[]> {
  try {
    const { data, error } = await supabase
      .from('indexing_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error reading history from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
}

/**
 * Save indexing results to Supabase
 */
export async function saveResults(results: StoredIndexResult[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('indexing_history')
      .insert(results);

    if (error) {
      console.error('Error saving results to Supabase:', error);
    }
  } catch (error) {
    console.error('Error saving results:', error);
  }
}

/**
 * Get indexing statistics from Supabase
 */
export async function getStats() {
  try {
    // Get total count and status counts
    const { count: total, error: countError } = await supabase
      .from('indexing_history')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting total count:', countError);
    }

    const { count: successful, error: successError } = await supabase
      .from('indexing_history')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'success');

    if (successError) {
      console.error('Error getting success count:', successError);
    }

    const totalCount = total || 0;
    const successCount = successful || 0;
    const failed = totalCount - successCount;

    // Get stats for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentTotal, error: recentError } = await supabase
      .from('indexing_history')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    const { count: recentSuccess, error: recentSuccessError } = await supabase
      .from('indexing_history')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'success')
      .gte('created_at', sevenDaysAgo.toISOString());

    const recentTotalCount = recentTotal || 0;
    const recentSuccessCount = recentSuccess || 0;

    return {
      total: totalCount,
      successful: successCount,
      failed,
      successRate: totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(1) : '0',
      last7Days: {
        total: recentTotalCount,
        successful: recentSuccessCount,
        failed: recentTotalCount - recentSuccessCount
      }
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      total: 0,
      successful: 0,
      failed: 0,
      successRate: '0',
      last7Days: {
        total: 0,
        successful: 0,
        failed: 0
      }
    };
  }
}

/**
 * Clear all history from Supabase
 */
export async function clearHistory(): Promise<void> {
  try {
    const { error } = await supabase
      .from('indexing_history')
      .delete()
      .neq('id', 0); // Delete all records

    if (error) {
      console.error('Error clearing history:', error);
    }
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}
