'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowForward, ShoppingBag } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: { xs: '60vh', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="xl">
        <Grid container alignItems="center" spacing={4}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 'bold',
                  color: 'grey.900',
                  mb: 2,
                  lineHeight: 1.2
                }}
              >
                Transform Your
                <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
                  Living Space
                </Box>
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  color: 'grey.700',
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.4,
                  maxWidth: { md: '80%' }
                }}
              >
                Discover our curated collection of premium furniture designed for modern living.
                Create the perfect home with pieces that blend style, comfort, and functionality.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/products"
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Shop Now
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/category/living-room"
                  startIcon={<ShoppingBag />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Browse Collection
                </Button>
              </Box>

              {/* Stats */}
              <Box sx={{ display: 'flex', gap: 4, mt: 6, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    1000+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Premium Products
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    50K+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Happy Customers
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    98%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Satisfaction Rate
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: '300px', md: '500px' },
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: 3
                }}
              >
                <Image
                  src="/assets/images/hero-furniture.jpg"
                  alt="Modern Living Room Furniture"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = '/assets/placeholder.svg';
                  }}
                />
                
                {/* Floating Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px'
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      borderRadius: 2,
                      p: 2,
                      boxShadow: 2,
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      Free Shipping
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      On orders over $299
                    </Typography>
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px'
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      borderRadius: 2,
                      p: 2,
                      boxShadow: 2,
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                      30-Day Returns
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Easy & hassle-free
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Background Decorations */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '60%',
          height: '200%',
          background: 'linear-gradient(45deg, rgba(25,118,210,0.1) 0%, rgba(220,0,78,0.1) 100%)',
          borderRadius: '50%',
          zIndex: -1
        }}
      />
    </Box>
  );
}
