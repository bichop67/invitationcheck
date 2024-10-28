import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oisfalfseanztglsjeaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pc2ZhbGZzZWFuenRnbHNqZWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwNjY4NzksImV4cCI6MjA0NTY0Mjg3OX0.aUkJN628BI57dK7FGfKypedzP2hAmgBswgiaEkNbo4E';

export const supabase = createClient(supabaseUrl, supabaseKey);