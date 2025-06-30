'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Skeleton
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { ProductCard } from '@/components/product/ProductCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  images: string[];
  sku: string;
  saleLabel?: string;
  newLabel?: string;
  quantity: number;
  subDescription?: string;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=8');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      // Set mock data for development
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockProducts = (): Product[] => [
    {
      id: '1',
      name: 'Modern Sectional Sofa',
      slug: 'modern-sectional-sofa',
      price: 1299.99,
      mrp: 1599.99,
      images: ['/assets/placeholder.svg'],
      sku: 'SOF-001',
      newLabel: 'New',
      quantity: 5,
      subDescription: 'Comfortable L-shaped sofa perfect for modern living rooms'
    },
    {
      id: '2',
      name: 'Dining Table Set',
      slug: 'dining-table-set',
      price: 899.99,
      mrp: 1199.99,
      images: ['/assets/placeholder.svg'],
      sku: 'DIN-001',
      saleLabel: 'Sale',
      quantity: 3,
      subDescription: '6-seater dining table with comfortable chairs'
    },
    {
      id: '3',
      name: 'Ergonomic Office Chair',
      slug: 'ergonomic-office-chair',
      price: 399.99,
      mrp: 499.99,
      images: ['/assets/placeholder.svg'],
      sku: 'CHA-001',
      quantity: 10,
      subDescription: 'Premium office chair with lumbar support'
    },
    {
      id: '4',
      name: 'Coffee Table',
      slug: 'coffee-table',
      price: 299.99,
      mrp: 299.99,
      images: ['/assets/placeholder.svg'],
      sku: 'TAB-001',
      quantity: 7,
      subDescription: 'Sleek glass-top coffee table for living room'
    },
    {
      id: '5',
      name: 'Bookshelf',
      slug: 'bookshelf',
      price: 199.99,
      mrp: 249.99,
      images: ['/assets/placeholder.svg'],
      sku: 'BOO-001',
      quantity: 12,
      subDescription: '5-tier wooden bookshelf with modern design'
    },
    {
      id: '6',
      name: 'Bed Frame',
      slug: 'bed-frame',
      price: 699.99,
      mrp: 799.99,
      images: ['/assets/placeholder.svg'],
      sku: 'BED-001',
      quantity: 4,
      subDescription: 'Queen size upholstered bed frame'
    },
    {
      id: '7',
      name: 'Wardrobe',
      slug: 'wardrobe',
      price: 899.99,
      mrp: 1099.99,
      images: ['/assets/placeholder.svg'],
      sku: 'WAR-001',
      saleLabel: 'Hot',
      quantity: 2,
      subDescription: '3-door wardrobe with mirror and storage'
    },
    {
      id: '8',
      name: 'Nightstand',
      slug: 'nightstand',
      price: 149.99,
      mrp: 179.99,
      images: ['/assets/placeholder.svg'],
      sku: 'NIG-001',
      quantity: 8,
      subDescription: 'Compact nightstand with 2 drawers'
    }
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 'bold',
              color: 'grey.900',
              mb: 2
            }}
          >
            Featured Products
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'grey.600',
              mb: 4,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Discover our handpicked selection of premium furniture pieces that combine style, comfort, and quality craftsmanship.
          </Typography>
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard product={{} as Product} loading />
                </Grid>
              ))
            : products.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard product={product} />
                </Grid>
              ))
          }
        </Grid>

        {/* View All Button */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/products"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 3,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
