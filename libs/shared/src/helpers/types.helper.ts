export type ExtractEnumTypes<T extends Record<string, string>> = T[keyof T];
