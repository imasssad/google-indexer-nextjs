-- ============================================
-- Google Indexer - Supabase Database Schema
-- ============================================
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard: https://dasptbiiiqxwnfotstzv.supabase.co
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy and paste this entire file
-- 5. Click "Run" to execute
-- ============================================

-- Create the indexing_history table
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

-- Add comments for documentation
COMMENT ON TABLE indexing_history IS 'Stores the history of all URL indexing attempts';
COMMENT ON COLUMN indexing_history.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN indexing_history.url IS 'The URL that was submitted for indexing';
COMMENT ON COLUMN indexing_history.status IS 'Whether the indexing succeeded or failed';
COMMENT ON COLUMN indexing_history.methods_used IS 'Array of indexing methods used (IndexNow, Google API, etc.)';
COMMENT ON COLUMN indexing_history.timestamp IS 'When the indexing attempt was made';
COMMENT ON COLUMN indexing_history.created_at IS 'When this record was created in the database';

-- Enable Row Level Security (RLS)
ALTER TABLE indexing_history ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Policy 1: Allow public read access (for dashboard viewing)
DROP POLICY IF EXISTS "Allow public read access" ON indexing_history;
CREATE POLICY "Allow public read access" ON indexing_history
  FOR SELECT
  USING (true);

-- Policy 2: Allow public insert access (for indexing operations)
DROP POLICY IF EXISTS "Allow public insert access" ON indexing_history;
CREATE POLICY "Allow public insert access" ON indexing_history
  FOR INSERT
  WITH CHECK (true);

-- Policy 3: Allow public delete access (for clearing history)
DROP POLICY IF EXISTS "Allow public delete access" ON indexing_history;
CREATE POLICY "Allow public delete access" ON indexing_history
  FOR DELETE
  USING (true);

-- Optional: Create a function to get statistics (faster than client-side calculation)
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

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Table: indexing_history';
  RAISE NOTICE '  - Columns: id, url, status, methods_used, timestamp, created_at';
  RAISE NOTICE '  - Indexes: created_at (DESC), status, url';
  RAISE NOTICE '  - RLS: Enabled with public read/insert/delete policies';
  RAISE NOTICE '';
  RAISE NOTICE 'Function: get_indexing_stats()';
  RAISE NOTICE '  - Returns JSON with total, successful, failed, success_rate, last_7_days';
  RAISE NOTICE '';
  RAISE NOTICE 'Your Supabase URL: https://dasptbiiiqxwnfotstzv.supabase.co';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Add environment variables to Vercel';
  RAISE NOTICE '  2. Deploy your application';
  RAISE NOTICE '  3. Test the indexing and dashboard';
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
END $$;
