import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tzihbabkequehdsiyqqi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6aWhiYWJrZXF1ZWhkc2l5cXFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU3MDc0MSwiZXhwIjoyMDY1MTQ2NzQxfQ.QBAnHAp_xWyqW_5u9XqpOhQ30nd7SnjzPCSFCqrEe6g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);