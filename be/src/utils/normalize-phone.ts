export function normalizeWhatsApp(input: string): string {
  const cleaned = input.replace(/[\s\-\.]/g, '');
  
  if (cleaned.startsWith('+62')) return cleaned;
  if (cleaned.startsWith('62')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+62${cleaned.slice(1)}`;
  
  return `+62${cleaned}`;
}
