-- Supabase Database Schema for Google Indexer
-- Run this SQL in your Supabase SQL Editor

-- Create indexing_history table
CREATE TABLE IF NOT EXISTS indexing_history (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  methods_used JSONB NOT NULL DEFAULT '[]'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_indexing_history_created_at ON indexing_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_indexing_history_status ON indexing_history(status);
CREATE INDEX IF NOT EXISTS idx_indexing_history_url ON indexing_history(url);

-- Enable Row Level Security (RLS)
ALTER TABLE indexing_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can customize this based on your needs)
CREATE POLICY "Allow all operations on indexing_history" ON indexing_history
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Create a function to get statistics
CREATE OR REPLACE FUNCTION get_indexing_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total', COUNT(*),
    'successful', COUNT(*) FILTER (WHERE status = 'success'),
    'failed', COUNT(*) FILTER (WHERE status = 'failed'),
    'success_rate', ROUND((COUNT(*) FILTER (WHERE status = 'success')::NUMERIC / NULLIF(COUNT(*), 0) * 100), 1),
    'last_7_days', (
      SELECT json_build_object(
        'total', COUNT(*),
        'successful', COUNT(*) FILTER (WHERE status = 'success'),
        'failed', COUNT(*) FILTER (WHERE status = 'failed')
      )
      FROM indexing_history
      WHERE created_at >= NOW() - INTERVAL '7 days'
    )
  ) INTO result
  FROM indexing_history;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
