import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eaqghrfwjunriasozpmg.supabase.co';
const supabaseServiceKey = 'sb_secret_Zuze42CXU7_131fzSelukA_sjiFJHVi';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  const email = 'admin@moonscents.com';
  const password = 'password123';

  console.log(`Creating/Updating admin user: ${email}...`);

  // 1. Create or invite the user
  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Moonscents Admin' },
    app_metadata: { role: 'admin' }
  });

  if (createError) {
    if (createError.message.includes('already registered')) {
      console.log('User already exists. Updating metadata to admin...');
      
      // Get the user ID first
      const { data: users } = await supabase.auth.admin.listUsers();
      const existingUser = users.users.find(u => u.email === email);
      
      if (existingUser) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { app_metadata: { role: 'admin' } }
        );
        if (updateError) console.error('Update error:', updateError);
        else console.log('Successfully promoted existing user to admin!');
      }
    } else {
      console.error('Error creating admin:', createError.message);
    }
  } else {
    console.log('Admin user created successfully!');
    console.log('User ID:', userData.user?.id);
  }
}

createAdmin();
