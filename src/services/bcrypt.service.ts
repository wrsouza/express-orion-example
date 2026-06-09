import { compareSync, hashSync } from "bcryptjs";

export class BcryptService {
  static hashPassword(password: string): string {
    const saltRounds = 12; 
    return hashSync(password, saltRounds);
  }

  static comparePassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}