import bcrypt from "bcrypt";

export async function hashPassword(
  password: string,
  salt: number
): Promise<string> {
  let hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function comparePassword(
  hash: string,
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
