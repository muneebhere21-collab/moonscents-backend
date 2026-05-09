import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eaqghrfwjunriasozpmg.supabase.co';
const supabaseServiceKey = 'sb_secret_Zuze42CXU7_131fzSelukA_sjiFJHVi';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetAdmin() {
  const email = 'admin@moonscents.com';
  const newPassword = 'password123';

  console.log(`Hard Resetting admin password for: ${email}...`);

  // Find user
  const { data: users } = await supabase.auth.admin.listUsers();
  const existingUser = users.users.find(u => u.email === email);
  
  if (existingUser) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { 
        password: newPassword,
        email_confirm: true,
        app_metadata: { role: 'admin' }
      }
    );
    if (updateError) console.error('Reset error:', updateError.message);
    else console.log('Successfully reset password to: password123');
  } else {
    console.log('User not found. Creating fresh admin...');
    const { error: createError } = await supabase.auth.admin.createUser({
      email,
      password: newPassword,
      email_confirm: true,
      app_metadata: { role: 'admin' }
    });
    if (createError) console.error('Create error:', createError.message);
    else console.log('Successfully created admin with password: password123');
  }
}

resetAdmin();
