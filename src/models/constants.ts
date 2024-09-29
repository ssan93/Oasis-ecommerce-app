export const ITEM_MAX_QUANTITY_SELECTOR = 5;
export const ITEM_FALLBACK_LIMIT = 4;
export const TRANSACTION_FEE = 1000;
export const SECRET_COOKIE_NAME = `payload-${
  process.env.NODE_ENV === "production" ? "prod" : "dev"
}-token`;
