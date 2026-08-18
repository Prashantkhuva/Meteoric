export function sanitizeSearch(input) {
  if (!input) return "";
  return input.replace(/[\\(%)_]/g, (c) => {
    if (c === "\\") return "\\\\";
    return `\\${c}`;
  });
}