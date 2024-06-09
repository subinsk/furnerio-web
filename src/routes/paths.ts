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
  about:"/about",
  contact:"/contact",
  faqs:"/faqs",
  checkout: `/checkout`,
  user:{
    root:"/user",
    profile:"/user/profile",
  },
  product: {
    root: `/product`,
    details: (slug: string) => `/product/${slug}`,
  },
};
