import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tgqbhgdvhprgifeskaev.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncWJoZ2R2aHByZ2lmZXNrYWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTMzNjMsImV4cCI6MjA4OTU4OTM2M30.5PwSeTH5KQyooanRBXpmPXwWeL-SexkucYdGpXBVPhs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertTenant() {
  const { data, error } = await supabase
    .from('cap_tenants')
    .insert([
      { slug: 'salaomaria', name: 'Salão da Maria', status: 'active', plan_price: 59.99 }
    ]);
    
  console.log("Insert result:", data);
  console.log("Insert error:", error);
}

insertTenant();
