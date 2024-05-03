const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
};

export const paths = {
  auth: {
    root: ROOTS.AUTH,
    login: `${ROOTS.AUTH}/login`,
  },
  dashboard: {
    root: ROOTS.DASHBOARD,
    categories: {
      root: `${ROOTS.DASHBOARD}/categories`,
      new: `${ROOTS.DASHBOARD}/add-category`,
    },
    products: {
      root: `${ROOTS.DASHBOARD}/products`,
      new: `${ROOTS.DASHBOARD}/product/new`,
    },
    orders: {
      root: `${ROOTS.DASHBOARD}/orders`,
    },
  },
};
