import bcrypt from "bcrypt"; // or 'bcryptjs'

const saltRounds = 10; // Adjust cost factor as needed

// Function to hash a password
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

// Function to verify a password
export async function verifyPassword(password: string, userHash: string): Promise<boolean> {
  const match = await bcrypt.compare(password, userHash);
  return match;
}
