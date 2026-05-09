import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eaqghrfwjunriasozpmg.supabase.co';
const supabaseServiceKey = 'sb_secret_Zuze42CXU7_131fzSelukA_sjiFJHVi';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testFetch() {
  console.log("Testing Supabase connection...");
  const { data, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error("Connection Error:", error.message);
  } else {
    console.log(`Success! Found ${data.length} products.`);
    if (data.length > 0) {
      console.log("First product sample:", data[0].name);
    }
  }
}

testFetch();
