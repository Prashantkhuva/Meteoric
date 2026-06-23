export function downloadCSV(data, columns, filename) {
  const headers = columns.map((c) => c.label);
  const rows = data.map((item) =>
    columns.map((c) => {
      const val = c.accessor(item);
      const str = String(val ?? "");
      return `"${str.replace(/"/g, '""')}"`;
    })
  );
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
