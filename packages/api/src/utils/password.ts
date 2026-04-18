import { genSalt, hash, compare } from 'bcryptjs';

const BCRYPT_COST = 12;

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(BCRYPT_COST);
  const hashed = await hash(password, salt);
  return hashed;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await compare(password, hash);
  } catch {
    return false;
  }
}