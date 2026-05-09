import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eaqghrfwjunriasozpmg.supabase.co';
const supabaseServiceKey = 'sb_secret_Zuze42CXU7_131fzSelukA_sjiFJHVi';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testFetch() {
  console.log("Deep Scan: Testing Supabase connection...");
  const { data, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error("Connection Error:", error.message);
  } else {
    console.log(`Deep Scan Results: Found ${data ? data.length : 0} products.`);
    if (data && data.length > 0) {
      console.log("Sample Fragrance:", data[0].name);
    }
  }
}

testFetch();
