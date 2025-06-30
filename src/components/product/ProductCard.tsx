'use client';

import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
  Rating,
  Skeleton
} from '@mui/material';
import { FavoriteBorder, Favorite, ShoppingCart } from '@mui/icons-material';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';

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

interface ProductCardProps {
  product: Product;
  loading?: boolean;
}

export function ProductCard({ product, loading = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { addItem } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/assets/placeholder.svg',
      sku: product.sku,
      quantity: 1
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discountPercentage = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" height={250} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" height={32} />
          <Skeleton variant="text" height={24} width="60%" />
          <Skeleton variant="text" height={20} width="80%" />
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" height={36} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
          '& .product-actions': {
            opacity: 1,
            transform: 'translateY(0)'
          },
          '& .product-image': {
            transform: 'scale(1.05)'
          }
        }
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Product Labels */}
        <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 2, display: 'flex', gap: 1 }}>
          {product.newLabel && (
            <Chip 
              label="New" 
              size="small" 
              color="success" 
              sx={{ fontWeight: 'bold' }}
            />
          )}
          {discountPercentage > 0 && (
            <Chip 
              label={`-${discountPercentage}%`} 
              size="small" 
              color="error" 
              sx={{ fontWeight: 'bold' }}
            />
          )}
          {product.saleLabel && (
            <Chip 
              label={product.saleLabel} 
              size="small" 
              color="warning" 
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>

        {/* Wishlist Button */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,1)'
            }
          }}
          onClick={handleWishlistToggle}
        >
          {isWishlisted ? (
            <Favorite color="error" />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>

        {/* Product Image */}
        <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
          <Box sx={{ position: 'relative', paddingTop: '75%' }}>
            {imageLoading && (
              <Skeleton
                variant="rectangular"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              />
            )}
            <Image
              src={product.images[0] || '/assets/placeholder.svg'}
              alt={product.name}
              fill
              style={{ 
                objectFit: 'cover',
                transition: 'transform 0.3s ease-in-out'
              }}
              className="product-image"
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </Box>
        </Link>

        {/* Quick Actions */}
        <Box
          className="product-actions"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            right: 8,
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <Button
            variant="contained"
            fullWidth
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white'
              }
            }}
          >
            {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              mb: 1,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.name}
          </Typography>
        </Link>

        {product.subDescription && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.subDescription}
          </Typography>
        )}

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={4.5} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            (23)
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography
              variant="h6"
              component="span"
              color="primary"
              sx={{ fontWeight: 'bold' }}
            >
              {formatPrice(product.price)}
            </Typography>
            {discountPercentage > 0 && (
              <Typography
                variant="body2"
                component="span"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary'
                }}
              >
                {formatPrice(product.mrp)}
              </Typography>
            )}
          </Box>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
