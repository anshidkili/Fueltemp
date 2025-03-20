import { supabase } from "../lib/supabase";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "superadmin" | "admin" | "employee" | "customer";
  avatar?: string;
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch user profile data
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: profileData.full_name,
        role: profileData.role,
        avatar: profileData.avatar_url,
      } as AuthUser,
      session: data.session,
    };
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) return null;

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) return null;

    // Fetch profile data
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    if (profileError) return null;

    return {
      id: userData.user.id,
      email: userData.user.email!,
      name: profileData.full_name,
      role: profileData.role,
      avatar: profileData.avatar_url,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
