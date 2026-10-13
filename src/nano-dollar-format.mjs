import { toNanoDollars } from "./nano-dollar-value.mjs";

function formatNanoValue(amount) {
  const nanoDollars = toNanoDollars(amount);
  return `${new Intl.NumberFormat("en-US").format(nanoDollars)}n`;
}

export { formatNanoValue };
