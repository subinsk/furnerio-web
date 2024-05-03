export type User = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  password: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
