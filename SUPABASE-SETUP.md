# Supabase Setup Guide

This guide will help you set up Supabase for your Google Indexer app.

## Step 1: Create a Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: google-indexer
   - **Database Password**: (choose a strong password)
   - **Region**: (choose closest to you)
5. Click "Create new project" and wait ~2 minutes

## Step 2: Get Your API Keys

1. In your project dashboard, click on the **Settings** icon (gear) in the left sidebar
2. Go to **API** section
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## Step 3: Update Your `.env.local` File

Replace the placeholder values in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## Step 4: Create the Database Table

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-schema.sql` file
4. Click **Run** (or press Ctrl/Cmd + Enter)
5. You should see: "Success. No rows returned"

## Step 5: Verify the Setup

1. Go to **Table Editor** in the left sidebar
2. You should see the `indexing_history` table
3. Click on it to see the structure:
   - `id` (bigint, primary key)
   - `url` (text)
   - `status` (text)
   - `methods_used` (jsonb)
   - `timestamp` (timestamptz)
   - `created_at` (timestamptz)

## Step 6: Test Your App

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Submit a test URL at http://localhost:3000

3. Check your Supabase dashboard:
   - Go to **Table Editor** → `indexing_history`
   - You should see your indexing records!

4. Test the API:
   ```bash
   # Get history
   curl http://localhost:3000/api/history

   # Get stats
   curl http://localhost:3000/api/history?stats=true
   ```

## Features

### ✅ Benefits of Using Supabase:

- **Free Tier**: 500MB database, 2GB bandwidth/month
- **Persistent**: Data survives server restarts
- **Real-time**: Can add real-time subscriptions later
- **Scalable**: Automatically scales with your needs
- **Backups**: Automatic daily backups (paid plans)
- **SQL Access**: Full PostgreSQL power
- **Dashboard**: Beautiful UI to view/manage data

### 📊 What's Stored:

Every indexing attempt saves:
- URL that was indexed
- Success/failure status
- Methods used (Google API, IndexNow, etc.)
- Timestamp of indexing
- Detailed method results

### 🔒 Security:

The current setup allows public read/write access. For production, you should:

1. Update the RLS policy in Supabase
2. Add authentication
3. Restrict who can write/read data

## Troubleshooting

### "Failed to fetch history" error:
- Check that your `.env.local` has the correct Supabase URL and key
- Verify the table was created successfully
- Restart your dev server after updating `.env.local`

### Data not saving:
- Check browser console for errors
- Check Supabase dashboard → Logs
- Verify RLS policies are set correctly

### Need to clear all data:
```bash
curl -X DELETE http://localhost:3000/api/history
```

Or in Supabase SQL Editor:
```sql
TRUNCATE indexing_history;
```

## Next Steps

Once your Supabase is set up, you can:

1. View all indexing history in Supabase dashboard
2. Export data as CSV/JSON
3. Run SQL queries for custom analytics
4. Set up automated reports
5. Add more features like user accounts

Enjoy your persistent indexing history! 🎉
