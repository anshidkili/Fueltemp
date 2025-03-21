import connectToDatabase from "../lib/mongodb";
import User from "../models/User";
import { createToken, verifyToken } from "../lib/jwt";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "superadmin" | "admin" | "employee" | "customer";
  avatar?: string;
}

export async function signIn(email: string, password: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = createToken({ userId: user._id });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.full_name,
        role: user.role,
        avatar: user.avatar_url,
      } as AuthUser,
      session: { token },
    };
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

export async function signOut() {
  // With JWT, we don't need to do anything server-side
  // The client will remove the token
  return true;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // For browser compatibility, use try-catch when accessing localStorage
    let token;
    try {
      token = localStorage.getItem("auth_token");
    } catch (e) {
      console.error("Error accessing localStorage:", e);
      return null;
    }

    if (!token) return null;

    try {
      await connectToDatabase();

      const decoded = verifyToken(token) as { userId: string };
      if (!decoded || !decoded.userId) return null;

      const user = await User.findById(decoded.userId);
      if (!user) return null;

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.full_name,
        role: user.role,
        avatar: user.avatar_url,
      };
    } catch (e) {
      console.error("Error verifying token or fetching user:", e);
      return null;
    }
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
