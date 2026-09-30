import { supabase } from '../src/config/supabase';

async function seedAdmin() {
  try {
    console.log('Creating admin user...');
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@gmail.com',
      password: 'Adminlogo123',
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✓ Admin user already exists');
      } else {
        throw error;
      }
    } else {
      console.log('✓ Admin user created:', data.user.email);
    }
  } catch (error) {
    console.error('❌ Seed failed:', error);
  }
}

seedAdmin();
