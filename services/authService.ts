// Authentication Service — Supabase Auth Integration
import { supabase } from './supabaseClient';

export interface FarmerUser {
  id: string;
  name: string;
  email: string;
  age: number;
  location: string; // Tamil Nadu district name
  crop: string;
  registeredAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  age: number;
  location: string;
  crop: string;
}

// ─── Register ──────────────────────────────────────────────────────────────────
export async function registerFarmer(data: RegisterData): Promise<FarmerUser> {
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: data.email.trim().toLowerCase(),
    password: data.password,
    options: {
      data: {
        name: data.name.trim(),
        age: data.age,
        location: data.location,
        crop: data.crop,
      },
    },
  });

  if (signUpError) throw new Error(signUpError.message);
  if (!authData.user) throw new Error('Registration failed. Please try again.');

  // Fetch the profile created by the trigger
  const profile = await fetchProfile(authData.user.id);
  return profile;
}

// ─── Login ─────────────────────────────────────────────────────────────────────
export async function loginFarmer(email: string, password: string): Promise<FarmerUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Invalid email or password. Please try again.');
    }
    throw new Error(error.message);
  }
  if (!data.user) throw new Error('Login failed. Please try again.');

  const profile = await fetchProfile(data.user.id);
  return profile;
}

// ─── Logout ────────────────────────────────────────────────────────────────────
export async function logoutFarmer(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

// ─── Fetch Profile ─────────────────────────────────────────────────────────────
export async function fetchProfile(userId: string): Promise<FarmerUser> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) throw new Error('Failed to load farmer profile.');

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    age: data.age,
    location: data.location,
    crop: data.crop,
    registeredAt: data.created_at,
  };
}

// ─── Get Current Session User ──────────────────────────────────────────────────
export async function getCurrentUser(): Promise<FarmerUser | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  try {
    return await fetchProfile(session.user.id);
  } catch {
    return null;
  }
}

// ─── Update Profile ────────────────────────────────────────────────────────────
export async function updateProfile(userId: string, updates: Partial<Pick<FarmerUser, 'name' | 'age' | 'location' | 'crop'>>): Promise<FarmerUser> {
  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw new Error(error.message);
  return fetchProfile(userId);
}
