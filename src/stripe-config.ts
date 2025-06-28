export const STRIPE_PRODUCTS = {
  course: {
    id: 'prod_Sa9RoMpTrMkyiv',
    priceId: 'price_1Rez8xRohcLhrWwwLQkAgbpX',
    name: 'Course Purchase',
    description: 'Pay per course',
    mode: 'payment' as const,
  },
  membership: {
    id: 'prod_Sa9PlXNz6HgH3y',
    priceId: 'price_1Rez6nRohcLhrWwwIdCpA41f',
    name: 'Membership',
    description: 'You get access to all courses',
    mode: 'subscription' as const,
  },
} as const;

export type ProductKey = keyof typeof STRIPE_PRODUCTS;
export type StripeProduct = typeof STRIPE_PRODUCTS[ProductKey];