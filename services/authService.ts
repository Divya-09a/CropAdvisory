// Authentication Service — Mock Auth using AsyncStorage
// Data is stored locally on the device

import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@crop_advisory_users';
const SESSION_KEY = '@crop_advisory_session';

export interface FarmerUser {
  id: string;
  name: string;
  email: string;
  password: string; // plain text for demo only
  age: number;
  location: string; // Tamil Nadu district name
  crop: string;
  registeredAt: string;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
}

// ─── Demo Credentials (pre-seeded) ────────────────────────────────────────────
const DEMO_USERS: FarmerUser[] = [
  {
    id: 'demo-001',
    name: 'Ravi Kumar',
    email: 'ravi@farmer.com',
    password: '123456',
    age: 42,
    location: 'Thanjavur',
    crop: 'Rice',
    registeredAt: new Date().toISOString(),
  },
  {
    id: 'demo-002',
    name: 'Meena Devi',
    email: 'meena@farmer.com',
    password: '123456',
    age: 35,
    location: 'Coimbatore',
    crop: 'Sugarcane',
    registeredAt: new Date().toISOString(),
  },
];

async function getUsers(): Promise<FarmerUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  if (!raw) return DEMO_USERS;
  const stored: FarmerUser[] = JSON.parse(raw);
  // Merge demo users if not already present
  const allUsers = [...DEMO_USERS];
  for (const u of stored) {
    if (!allUsers.find(x => x.id === u.id)) allUsers.push(u);
  }
  return allUsers;
}

async function saveUsers(users: FarmerUser[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function registerFarmer(data: Omit<FarmerUser, 'id' | 'registeredAt'>): Promise<FarmerUser> {
  const users = await getUsers();
  if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }
  const newUser: FarmerUser = {
    ...data,
    id: `user-${Date.now()}`,
    registeredAt: new Date().toISOString(),
  };
  await saveUsers([...users.filter(u => !DEMO_USERS.find(d => d.id === u.id)), newUser]);
  return newUser;
}

export async function loginFarmer(email: string, password: string): Promise<FarmerUser> {
  const users = await getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error('Invalid email or password. Please try again.');
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, email: user.email, name: user.name }));
  return user;
}

export async function logoutFarmer(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getSession(): Promise<Session | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function getCurrentUser(): Promise<FarmerUser | null> {
  const session = await getSession();
  if (!session) return null;
  const users = await getUsers();
  return users.find(u => u.id === session.userId) || null;
}
