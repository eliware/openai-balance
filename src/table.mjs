function formatTable(headers, rows) {
  const widths = headers.map((header, index) => {
    const cellWidths = rows.map((row) => String(row[index]).length);
    return Math.max(header.length, ...cellWidths);
  });
  const renderRow = (row) =>
    row.map((cell, index) => String(cell).padEnd(widths[index])).join(" | ");
  const separator = widths.map((width) => "-".repeat(width)).join("-|-");
  return [renderRow(headers), separator, ...rows.map(renderRow)].join("\n");
}

export { formatTable };
