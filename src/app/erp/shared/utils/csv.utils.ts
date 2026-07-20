/**
 * Splits a CSV line into an array of string values, correctly respecting
 * double quotes that enclose comma-separated text values (e.g. names "Doe, John" or descriptions).
 * Also trims leading/trailing whitespaces and strips wrapping double-quotes from the parsed tokens.
 */
export function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result.map(s => s.replace(/^"|"$/g, '').trim());
}
