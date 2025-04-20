import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

<<<<<<< HEAD
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
=======
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
>>>>>>> 477b11a9ef7f849fd867a3337d2496961fb5ebdb
