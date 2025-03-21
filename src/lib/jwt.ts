// Browser-compatible JWT implementation

// Simple base64 encoding/decoding for browser
const base64Encode = (str: string): string => {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }),
  );
};

const base64Decode = (str: string): string => {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), (c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
};

const JWT_SECRET = "fuel-station-secret-key-change-in-production";

// Simple JWT implementation for browser
export const createToken = (payload: any) => {
  // Create a simple header
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  // Add expiration (30 days)
  const now = Math.floor(Date.now() / 1000);
  payload = {
    ...payload,
    exp: now + 60 * 60 * 24 * 30, // 30 days
  };

  // Encode header and payload
  const encodedHeader = base64Encode(JSON.stringify(header));
  const encodedPayload = base64Encode(JSON.stringify(payload));

  // Create signature (in a real implementation, this would use crypto)
  // This is a simplified version for demo purposes
  const signature = base64Encode(JWT_SECRET + encodedHeader + encodedPayload);

  // Return the token
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const verifyToken = (token: string) => {
  try {
    // Split the token
    const [encodedHeader, encodedPayload, signature] = token.split(".");

    // Verify signature (simplified)
    const expectedSignature = base64Encode(
      JWT_SECRET + encodedHeader + encodedPayload,
    );
    if (signature !== expectedSignature) {
      throw new Error("Invalid signature");
    }

    // Decode payload
    const payload = JSON.parse(base64Decode(encodedPayload));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error("Token expired");
    }

    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw error;
  }
};
