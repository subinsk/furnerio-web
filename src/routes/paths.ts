const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
};

export const paths = {
  auth: {
    root: ROOTS.AUTH,
    login: `${ROOTS.AUTH}/login`,
  },
  home: {
    root: "/",
  },
  cart: {
    root: "/cart",
  },
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id:string) => `/product/${id}`,
  },
};
