export const PRODUCTS = {
  PLUS: "plus",
  PRO: "pro",
} as const;

export type Product = (typeof PRODUCTS)[keyof typeof PRODUCTS];

export const PRODUCT_CONFIGS = {
  [PRODUCTS.PLUS]: {
    slug: PRODUCTS.PLUS,
    productId: process.env.POLAR_PLUS_PRODUCT_ID,
  },
  [PRODUCTS.PRO]: {
    slug: PRODUCTS.PRO,
    productId: process.env.POLAR_PRO_PRODUCT_ID,
  },
} as const;

export const getSlugFromProductId = (productId: string): Product => {
  const product = Object.entries(PRODUCT_CONFIGS).find(
    ([, config]) => config.productId === productId,
  )?.[0];

  return product as Product;
};
