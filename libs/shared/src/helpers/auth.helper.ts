import * as bcrypt from 'bcryptjs';
import { BYCRYPT_HASH_REGEX } from '../constants';

export function isBcryptHash(value: string): boolean {
    return value.length === 60 && BYCRYPT_HASH_REGEX.test(value);
}

export async function bycryptHashPassword(password: string): Promise<string> {
    if (isBcryptHash(password)) return password
    const salt = await bcrypt.genSalt();
    return (await bcrypt.hash(password, salt));
}