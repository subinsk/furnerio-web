import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: Role;
      organizationId?: string;
      organization?: {
        id: string;
        name: string;
        subdomain?: string;
        customDomain?: string;
      };
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
    organizationId?: string;
    organization?: {
      id: string;
      name: string;
      subdomain?: string;
      customDomain?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    organizationId?: string;
    organization?: {
      id: string;
      name: string;
      subdomain?: string;
      customDomain?: string;
    };
  }
}
