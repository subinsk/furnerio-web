'use client';

import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';
import { useConfig } from '@/hooks/useConfig';
import { useOrganization } from '@/hooks/useOrganization';
import Image from 'next/image';
import NextLink from 'next/link';

export function Footer() {
  const { config } = useConfig();
  const { organization } = useOrganization();

  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {organization?.logo && (
                  <Image
                    src={organization.logo}
                    alt={organization.name || 'Store Logo'}
                    width={40}
                    height={40}
                    style={{ marginRight: 12 }}
                  />
                )}
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {organization?.name || config?.general?.storeName || 'Furnerio'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
                {config?.general?.storeDescription || 'Premium furniture for modern living spaces.'}
              </Typography>
              
              {/* Social Media */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton sx={{ color: 'white', '&:hover': { color: 'primary.main' } }}>
                  <Facebook />
                </IconButton>
                <IconButton sx={{ color: 'white', '&:hover': { color: 'primary.main' } }}>
                  <Twitter />
                </IconButton>
                <IconButton sx={{ color: 'white', '&:hover': { color: 'primary.main' } }}>
                  <Instagram />
                </IconButton>
                <IconButton sx={{ color: 'white', '&:hover': { color: 'primary.main' } }}>
                  <LinkedIn />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Links
            </Typography>
            <List disablePadding>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <Link component={NextLink} href="/products" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                  All Products
                </Link>
              </ListItem>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <Link component={NextLink} href="/category/living-room" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                  Living Room
                </Link>
              </ListItem>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <Link component={NextLink} href="/category/bedroom" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                  Bedroom
                </Link>
              </ListItem>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <Link component={NextLink} href="/category/dining" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                  Dining
                </Link>
              </ListItem>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <Link component={NextLink} href="/sale" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                  Sale
                </Link>
              </ListItem>
            </List>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Customer Service
            </Typography>
            <List disablePadding>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <Link component={NextLink} href="/contact" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                  Contact Us
                </Link>
              </ListItem>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <Link component={NextLink} href="/shipping" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                  Shipping Info
                </Link>
              </ListItem>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <Link component={NextLink} href="/returns" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                  Returns & Exchanges
                </Link>
              </ListItem>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <Link component={NextLink} href="/faq" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                  FAQ
                </Link>
              </ListItem>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <Link component={NextLink} href="/size-guide" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                  Size Guide
                </Link>
              </ListItem>
            </List>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Contact Information
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {config?.general?.address || '123 Furniture Street, Design City, DC 12345'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {config?.general?.contactPhone || '+1 (555) 123-4567'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ mr: 1, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {config?.general?.contactEmail || 'contact@furnerio.com'}
                </Typography>
              </Box>
            </Box>

            {/* Newsletter Signup */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Enter your email"
                variant="outlined"
                size="small"
                sx={{
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                    opacity: 1,
                  },
                }}
              />
              <Button variant="contained" color="primary">
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Bottom Section */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © {currentYear} {organization?.name || config?.general?.storeName || 'Furnerio'}. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 3, mt: { xs: 2, md: 0 } }}>
              <Link component={NextLink} href="/privacy-policy" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Privacy Policy
              </Link>
              <Link component={NextLink} href="/terms-of-service" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Terms of Service
              </Link>
              <Link component={NextLink} href="/cookies" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Cookies
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
