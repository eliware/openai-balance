function formatNanoValue(amount) {
  const nanoDollars = Math.round(amount * 1_000_000_000);
  return `${new Intl.NumberFormat("en-US").format(nanoDollars)}n`;
}

export { formatNanoValue };
