# Furnerio Webstore Implementation Guide

## 📋 Project Overview

This guide outlines the complete implementation of a multi-tenant webstore application that integrates with the Furnerio Admin Dashboard. Each organization will have their own branded webstore with customizable themes, payment methods, and product catalogs.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin Panel   │    │    Database     │    │    Webstore     │
│  (Dashboard)    │◄──►│   (Shared)      │◄──►│ (Multi-tenant)  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: Material-UI (MUI) v5
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Emotion + MUI Theme System
- **State Management**: Zustand
- **Payment**: Stripe, PayPal
- **Images**: Next.js Image Optimization
- **Deployment**: Vercel/Docker

## 📁 Project Structure

```
furnerio-webstore/
├── README.md
├── next.config.js
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── assets/
│   ├── uploads/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [slug]/
│   │   │   │   └── category/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── account/
│   │   │   ├── orders/
│   │   │   └── contact/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   ├── config/
│   │   │   ├── payments/
│   │   │   └── webhooks/
│   │   └── preview/
│   │       └── [previewId]/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Layout.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   └── ProductFilters.tsx
│   │   ├── cart/
│   │   │   ├── CartProvider.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx
│   │   │   ├── DynamicTheme.tsx
│   │   │   └── CustomStyles.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   ├── config.ts
│   │   ├── payments.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useConfig.ts
│   │   ├── useProducts.ts
│   │   └── useOrganization.ts
│   ├── store/
│   │   ├── cartStore.ts
│   │   ├── configStore.ts
│   │   └── userStore.ts
│   ├── types/
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   └── config.ts
│   └── middleware.ts
└── docs/
    ├── DEPLOYMENT.md
    ├── API.md
    └── CUSTOMIZATION.md
```

## 🔧 Core Implementation

### 1. Multi-Tenant Architecture

#### A. Organization Context Resolution

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host');
  const url = request.nextUrl;
  
  // Extract subdomain
  const subdomain = getSubdomain(host);
  
  // Resolve organization from subdomain or custom domain
  const organization = await resolveOrganization(subdomain, host);
  
  if (!organization) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
  
  // Set organization context in headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-organization-id', organization.id);
  requestHeaders.set('x-store-id', organization.defaultStoreId);
  
  return NextResponse.next({
    request: { headers: requestHeaders }
  });
}

function getSubdomain(host: string): string {
  if (!host) return '';
  const parts = host.split('.');
  return parts.length > 2 ? parts[0] : '';
}

async function resolveOrganization(subdomain: string, host: string) {
  // Check for custom domain first
  let org = await prisma.organization.findFirst({
    where: { customDomain: host }
  });
  
  // Fallback to subdomain
  if (!org && subdomain) {
    org = await prisma.organization.findFirst({
      where: { subdomain }
    });
  }
  
  return org;
}
```

#### B. Organization Context Provider

```typescript
// src/lib/organization-context.ts
import { headers } from 'next/headers';

export function getOrganizationContext() {
  const headersList = headers();
  return {
    organizationId: headersList.get('x-organization-id'),
    storeId: headersList.get('x-store-id')
  };
}

// src/hooks/useOrganization.ts
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface OrganizationContextType {
  organization: Organization | null;
  store: Store | null;
  loading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  store: null,
  loading: true
});

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OrganizationContextType>({
    organization: null,
    store: null,
    loading: true
  });
  
  useEffect(() => {
    fetchOrganizationData().then(data => {
      setState({
        organization: data.organization,
        store: data.store,
        loading: false
      });
    });
  }, []);
  
  return (
    <OrganizationContext.Provider value={state}>
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganization = () => useContext(OrganizationContext);
```

### 2. Dynamic Configuration System

#### A. Configuration Hook

```typescript
// src/hooks/useConfig.ts
'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from './useOrganization';

export function useConfig() {
  const { store } = useOrganization();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!store?.id) return;
    
    fetchStoreConfig(store.id).then(data => {
      setConfig(data);
      setLoading(false);
    });
    
    // Poll for configuration updates
    const interval = setInterval(() => {
      checkForConfigUpdates(store.id).then(updates => {
        if (updates.length > 0) {
          fetchStoreConfig(store.id).then(setConfig);
        }
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, [store?.id]);
  
  return { config, loading };
}

async function fetchStoreConfig(storeId: string) {
  const response = await fetch(`/api/config?storeId=${storeId}`);
  return response.json();
}
```

#### B. Dynamic Theme Provider

```typescript
// src/components/theme/DynamicThemeProvider.tsx
'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useConfig } from '@/hooks/useConfig';

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const { config, loading } = useConfig();
  
  const theme = createTheme({
    palette: {
      primary: {
        main: config?.theme?.primaryColor || '#1976d2'
      },
      secondary: {
        main: config?.theme?.secondaryColor || '#dc004e'
      },
      background: {
        default: config?.theme?.backgroundColor || '#ffffff'
      }
    },
    typography: {
      fontFamily: config?.theme?.fontFamily || 'Inter, sans-serif',
      h1: {
        fontSize: config?.theme?.headingSize || '2.5rem'
      }
    },
    shape: {
      borderRadius: config?.theme?.borderRadius || 8
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: config?.theme?.buttonBorderRadius || 8,
            textTransform: config?.theme?.buttonTextTransform || 'none'
          }
        }
      }
    }
  });
  
  if (loading) {
    return <div>Loading theme...</div>;
  }
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {config?.theme?.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: config.theme.customCSS }} />
      )}
      {children}
    </ThemeProvider>
  );
}
```

### 3. Product Catalog System

#### A. Product Data Layer

```typescript
// src/lib/products.ts
import { getOrganizationContext } from './organization-context';

export async function getProducts(params: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}) {
  const { organizationId } = getOrganizationContext();
  
  const where = {
    organizationId,
    isActive: true,
    ...(params.category && { categoryId: params.category }),
    ...(params.search && {
      OR: [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } }
      ]
    })
  };
  
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true,
        variants: true
      },
      orderBy: getSortOrder(params.sortBy),
      skip: (params.page - 1) * params.limit,
      take: params.limit
    }),
    prisma.product.count({ where })
  ]);
  
  return { products, total };
}

function getSortOrder(sortBy: string) {
  switch (sortBy) {
    case 'price_asc': return { price: 'asc' };
    case 'price_desc': return { price: 'desc' };
    case 'name_asc': return { name: 'asc' };
    case 'newest': return { createdAt: 'desc' };
    default: return { createdAt: 'desc' };
  }
}
```

#### B. Product Components

```typescript
// src/components/product/ProductGrid.tsx
'use client';

import { Grid, Box, Pagination } from '@mui/material';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';

interface ProductGridProps {
  products: Product[];
  total: number;
  currentPage: number;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onPageChange: (page: number) => void;
}

export function ProductGrid({ 
  products, 
  total, 
  currentPage, 
  filters, 
  onFiltersChange,
  onPageChange 
}: ProductGridProps) {
  const totalPages = Math.ceil(total / filters.limit);
  
  return (
    <Box>
      <ProductFilters 
        filters={filters} 
        onFiltersChange={onFiltersChange} 
      />
      
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
      
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
```

### 4. Shopping Cart System

#### A. Cart Store (Zustand)

```typescript
// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(
          item => item.productId === newItem.productId && 
                  item.variantId === newItem.variantId
        );
        
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            )
          };
        }
        
        return {
          items: [...state.items, { ...newItem, id: generateId() }]
        };
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
        items: quantity <= 0 
          ? state.items.filter(item => item.id !== id)
          : state.items.map(item =>
              item.id === id ? { ...item, quantity } : item
            )
      })),
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);
```

### 5. Checkout & Payment System

#### A. Checkout Flow

```typescript
// src/components/checkout/CheckoutForm.tsx
'use client';

import { useState } from 'react';
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import { useConfig } from '@/hooks/useConfig';
import { useCartStore } from '@/store/cartStore';

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

export function CheckoutForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [orderData, setOrderData] = useState({
    shippingAddress: {},
    billingAddress: {},
    paymentMethod: '',
    notes: ''
  });
  
  const { config } = useConfig();
  const { items, getTotal, clearCart } = useCartStore();
  
  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
  
  const handleSubmitOrder = async () => {
    try {
      const order = await createOrder({
        items,
        total: getTotal(),
        ...orderData
      });
      
      // Process payment
      await processPayment(order.id, orderData.paymentMethod);
      
      clearCart();
      router.push(`/orders/${order.id}/confirmation`);
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {activeStep === 0 && (
        <ShippingForm 
          data={orderData.shippingAddress}
          onChange={(data) => setOrderData({...orderData, shippingAddress: data})}
          onNext={handleNext}
        />
      )}
      
      {activeStep === 1 && (
        <PaymentForm
          enabledMethods={config?.payment?.enabledMethods || []}
          selected={orderData.paymentMethod}
          onChange={(method) => setOrderData({...orderData, paymentMethod: method})}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      
      {activeStep === 2 && (
        <OrderReview
          orderData={orderData}
          items={items}
          total={getTotal()}
          onSubmit={handleSubmitOrder}
          onBack={handleBack}
        />
      )}
    </Box>
  );
}
```

#### B. Payment Integration

```typescript
// src/lib/payments.ts
import Stripe from 'stripe';

export async function processPayment(orderId: string, paymentMethod: string, paymentData: any) {
  switch (paymentMethod) {
    case 'stripe':
      return processStripePayment(orderId, paymentData);
    case 'paypal':
      return processPayPalPayment(orderId, paymentData);
    default:
      throw new Error('Unsupported payment method');
  }
}

async function processStripePayment(orderId: string, paymentData: any) {
  const { config } = await getStoreConfig();
  const stripe = new Stripe(config.payment.stripe.secretKey);
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: paymentData.amount * 100, // Convert to cents
    currency: config.payment.currency || 'usd',
    metadata: { orderId }
  });
  
  return paymentIntent;
}
```

### 6. API Routes

#### A. Products API

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const params = {
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '12'),
    sortBy: searchParams.get('sortBy') || 'newest'
  };
  
  try {
    const result = await getProducts(params);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

#### B. Configuration API

```typescript
// src/app/api/config/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getOrganizationContext } from '@/lib/organization-context';

export async function GET(request: NextRequest) {
  const { organizationId, storeId } = getOrganizationContext();
  
  try {
    const configs = await prisma.storeConfiguration.findMany({
      where: {
        organizationId,
        isActive: true
      }
    });
    
    const configMap = configs.reduce((acc, config) => {
      acc[config.category] = config.settings;
      return acc;
    }, {});
    
    return NextResponse.json(configMap);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}
```

### 7. Layout Components

#### A. Main Layout

```typescript
// src/app/layout.tsx
import { OrganizationProvider } from '@/hooks/useOrganization';
import { DynamicThemeProvider } from '@/components/theme/DynamicThemeProvider';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <OrganizationProvider>
          <DynamicThemeProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </DynamicThemeProvider>
        </OrganizationProvider>
      </body>
    </html>
  );
}
```

## 📦 Package.json Dependencies

```json
{
  "name": "furnerio-webstore",
  "version": "1.0.0",
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0",
    "next-auth": "^4.23.0",
    "zustand": "^4.4.0",
    "stripe": "^13.0.0",
    "@paypal/react-paypal-js": "^8.0.0",
    "react-hook-form": "^7.45.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "axios": "^1.5.0",
    "react-query": "^3.39.0",
    "framer-motion": "^10.16.0",
    "react-intersection-observer": "^9.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

## 🚀 Deployment Strategy

### 1. Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Admin Dashboard API
ADMIN_API_URL="https://admin.furnerio.com"
ADMIN_API_KEY="..."

# Auth
NEXTAUTH_URL="https://store.furnerio.com"
NEXTAUTH_SECRET="..."

# Payment
STRIPE_SECRET_KEY="..."
PAYPAL_CLIENT_ID="..."
PAYPAL_CLIENT_SECRET="..."

# File Storage
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
```

### 2. Deployment Options

#### A. Vercel (Recommended)
- Automatic subdomain routing
- Edge functions for organization resolution
- Global CDN for static assets

#### B. Docker + Custom Server
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 Key Features to Implement

### Phase 1: Core Features
- [x] Multi-tenant architecture
- [x] Dynamic theming
- [x] Product catalog
- [x] Shopping cart
- [x] Basic checkout

### Phase 2: Advanced Features
- [ ] User accounts & authentication
- [ ] Order management
- [ ] Inventory tracking
- [ ] Email notifications
- [ ] SEO optimization

### Phase 3: Enterprise Features
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] A/B testing
- [ ] Performance monitoring
- [ ] Advanced integrations

## 🔗 Integration Points

### Admin Dashboard → Webstore
1. **Configuration Sync**: Real-time theme and settings updates
2. **Product Sync**: Automatic product catalog updates
3. **Order Sync**: Order data flows back to admin dashboard
4. **Analytics Sync**: Customer behavior data collection

### Webstore → Admin Dashboard
1. **Order Notifications**: Real-time order alerts
2. **Inventory Updates**: Stock level synchronization
3. **Customer Data**: User registration and profile updates
4. **Performance Metrics**: Sales and conversion data

## 📋 Implementation Checklist

- [ ] Set up Next.js project with TypeScript
- [ ] Configure Prisma with shared database
- [ ] Implement middleware for organization resolution
- [ ] Create dynamic theme system
- [ ] Build product catalog components
- [ ] Implement shopping cart with Zustand
- [ ] Create checkout flow
- [ ] Integrate payment systems
- [ ] Set up API routes
- [ ] Configure deployment pipeline
- [ ] Test multi-tenant functionality
- [ ] Optimize performance
- [ ] Add monitoring and analytics

## 🎯 Success Metrics

1. **Performance**: Page load times < 2s
2. **Conversion**: Cart abandonment < 70%
3. **SEO**: Core Web Vitals in green
4. **Scalability**: Support 1000+ concurrent users per store
5. **Uptime**: 99.9% availability

This guide provides the foundation for building a scalable, multi-tenant webstore that seamlessly integrates with your admin dashboard. Each organization will have their own branded storefront while sharing the same underlying infrastructure.
