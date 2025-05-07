export const PRODUCTS = {
  PLUS: "plus",
  PRO: "pro",
} as const;

export type Product = (typeof PRODUCTS)[keyof typeof PRODUCTS];

export const PRODUCT_CONFIGS = {
  [PRODUCTS.PLUS]: {
    slug: PRODUCTS.PLUS,
    productId: "5f234b49-ff7c-462e-aec0-711688e248d1",
  },
  [PRODUCTS.PRO]: {
    slug: PRODUCTS.PRO,
    productId: "849604dd-17dd-43ae-9052-573fe23d2034",
  },
} as const;

export const getSlugFromProductId = (productId: string): Product => {
  const product = Object.entries(PRODUCT_CONFIGS).find(
    ([_, config]) => config.productId === productId,
  )?.[0];

  return product as Product;
};
