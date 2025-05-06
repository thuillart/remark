export const PRODUCTS = {
  PLUS: "plus",
  PRO: "pro",
} as const;

export type Product = (typeof PRODUCTS)[keyof typeof PRODUCTS];

export const PRODUCT_CONFIGS = {
  [PRODUCTS.PLUS]: {
    slug: PRODUCTS.PLUS,
    productId: "ae52a0b8-2506-4666-abbd-d88156b4479c",
  },
  [PRODUCTS.PRO]: {
    slug: PRODUCTS.PRO,
    productId: "58b07362-ece1-4cfb-91e8-af7984798763",
  },
} as const;

export const getSlugFromProductId = (productId: string): Product => {
  const product = Object.entries(PRODUCT_CONFIGS).find(
    ([_, config]) => config.productId === productId,
  )?.[0];

  return product as Product;
};
