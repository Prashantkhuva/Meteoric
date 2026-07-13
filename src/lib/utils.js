import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
  INR: "\u20B9",
  CAD: "CA$",
  AUD: "AU$",
  SGD: "S$",
  JPY: "\u00A5",
};

export function getCurrencySymbol(currency) {
  return CURRENCY_SYMBOLS[currency] || currency || "$";
}
