import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tgqbhgdvhprgifeskaev.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncWJoZ2R2aHByZ2lmZXNrYWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTMzNjMsImV4cCI6MjA4OTU4OTM2M30.5PwSeTH5KQyooanRBXpmPXwWeL-SexkucYdGpXBVPhs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('cap_tenants')
    .select('*');
    
  console.log("All tenants:", data);
  console.log("Error:", error);
}

test();
