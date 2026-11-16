import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vcbpkcbzsxnqqnurbgck.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYnBrY2J6c3hucXFudXJiZ2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTk2ODksImV4cCI6MjA5ODU3NTY4OX0.W1WHQGbKX8-NFNZgicuCCTgogEDpDwvePOwQUqVHoZE';

export const supabase = createClient(supabaseUrl, supabaseKey);
