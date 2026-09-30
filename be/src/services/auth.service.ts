import { supabase } from '../config/supabase';

interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error('Email atau password salah');
  }

  return {
    accessToken: authData.session.access_token,
    user: {
      id: authData.user.id,
      email: authData.user.email,
    },
  };
}
