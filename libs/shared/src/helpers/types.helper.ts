import { TPaginatedData } from "../types";

export type ExtractEnumTypes<T extends Record<string, string>> = T[keyof T];

// type guards for paginated data
export function isPaginatedData<T>(obj: any): obj is TPaginatedData<T> {
    return (
        obj &&
        typeof obj === 'object' &&
        Array.isArray(obj.data) &&
        obj.meta &&
        typeof obj.meta.page === 'number' &&
        typeof obj.meta.limit === 'number' &&
        typeof obj.meta.total === 'number' &&
        typeof obj.meta.pages === 'number'
    );
}