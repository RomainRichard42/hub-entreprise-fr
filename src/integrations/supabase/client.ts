// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://geoidjnxvqpdygbfxkoa.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlb2lkam54dnFwZHlnYmZ4a29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjY3NzgsImV4cCI6MjA0ODQ0Mjc3OH0.Ab5lPrD5cy0eEpsH7QdT7FwXG_uGWdwfeH2N_ryFiKM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);