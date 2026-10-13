function formatTimestampedOutput(output, now = () => new Date()) {
  return `${now().toISOString()} ${output}`;
}

export { formatTimestampedOutput };
