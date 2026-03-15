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

  // Upsert profile directly (handles cases where trigger may not fire)
  const { error: profileError } = await supabase
    .from('user_profiles')
    .upsert({
      id: authData.user.id,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      age: data.age,
      location: data.location,
      crop: data.crop,
    }, { onConflict: 'id' });

  if (profileError) {
    // Non-fatal: trigger may have already created it
    console.warn('Profile upsert warning:', profileError.message);
  }

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
  // Retry up to 3 times (trigger may have a brief delay)
  for (let attempt = 1; attempt <= 3; attempt++) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      return {
        id: data.id,
        name: data.name || 'Farmer',
        email: data.email || '',
        age: data.age || 25,
        location: data.location || 'Chennai',
        crop: data.crop || 'Rice',
        registeredAt: data.created_at || new Date().toISOString(),
      };
    }

    if (error && error.code !== 'PGRST116') {
      // Real DB error (not "no rows found")
      throw new Error(`Database error: ${error.message}`);
    }

    // Profile not found yet — wait and retry
    if (attempt < 3) {
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }

  // Final fallback: try to get user metadata from auth session
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    const meta = session.user.user_metadata;
    const fallbackProfile: FarmerUser = {
      id: userId,
      name: meta?.name || session.user.email?.split('@')[0] || 'Farmer',
      email: session.user.email || '',
      age: meta?.age || 25,
      location: meta?.location || 'Chennai',
      crop: meta?.crop || 'Rice',
      registeredAt: session.user.created_at || new Date().toISOString(),
    };

    // Try to create the profile if it still doesn't exist
    await supabase.from('user_profiles').upsert({
      id: userId,
      name: fallbackProfile.name,
      email: fallbackProfile.email,
      age: fallbackProfile.age,
      location: fallbackProfile.location,
      crop: fallbackProfile.crop,
    }, { onConflict: 'id' });

    return fallbackProfile;
  }

  throw new Error('Profile not found. Please try logging in again.');
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
