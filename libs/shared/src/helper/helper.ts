export function generateId(name: string, date: Date): string {
  const sanitizedName = name.toLowerCase().replace(/\s+/g, '');
  const timestamp = date.getTime();
  return `${sanitizedName}${timestamp}`;
}
