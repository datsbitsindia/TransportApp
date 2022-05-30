import * as bcrypt from "bcryptjs";

export const hashPassword = (
  password: string,
  salt: number | string = 8
): string => bcrypt.hashSync(password, salt);

export const compareHash = (password: string, hash: string): boolean =>
  bcrypt.compareSync(password, hash);
