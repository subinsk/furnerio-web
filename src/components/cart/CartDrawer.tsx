'use client';

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  ButtonGroup,
  Chip
} from '@mui/material';
import { Close, Add, Remove, ShoppingBag } from '@mui/icons-material';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';

export function CartDrawer() {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem, 
    getTotal, 
    getItemCount 
  } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={toggleCart}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } }
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Shopping Cart ({getItemCount()})
          </Typography>
          <IconButton onClick={toggleCart}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Cart Items */}
        {items.length === 0 ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center',
            gap: 2
          }}>
            <ShoppingBag sx={{ fontSize: 64, color: 'grey.400' }} />
            <Typography variant="h6" color="text.secondary">
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add some products to get started
            </Typography>
            <Button
              variant="contained"
              component={Link}
              href="/products"
              onClick={toggleCart}
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <>
            {/* Items List */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <List>
                {items.map((item) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      px: 0,
                      py: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={60}
                          height={60}
                          style={{ objectFit: 'cover' }}
                        />
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      sx={{ ml: 2 }}
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {item.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            SKU: {item.sku}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                              {formatPrice(item.price)}
                            </Typography>
                            <ButtonGroup size="small" variant="outlined">
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              <Chip
                                label={item.quantity}
                                variant="outlined"
                                size="small"
                                sx={{ borderRadius: 0, minWidth: 40 }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </ButtonGroup>
                          </Box>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => removeItem(item.id)}
                            sx={{ mt: 1, fontSize: '0.75rem' }}
                          >
                            Remove
                          </Button>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              
              {/* Total */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total:
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  {formatPrice(getTotal())}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  component={Link}
                  href="/checkout"
                  onClick={toggleCart}
                  sx={{ py: 1.5 }}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  component={Link}
                  href="/cart"
                  onClick={toggleCart}
                >
                  View Cart
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
