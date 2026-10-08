export function sanitizeSearch(input: string | null | undefined): string {
  if (!input) return "";
  return input.replace(/[\\(%)_]/g, (c) => {
    if (c === "\\") return "\\\\";
    return `\\${c}`;
  });
}