'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Button,
  TextField,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import {
  ShoppingCart,
  Search,
  Menu as MenuIcon,
  Person,
  Favorite,
  Close
} from '@mui/icons-material';
import { useCartStore } from '@/store/cartStore';
import { useOrganization } from '@/hooks/useOrganization';
import Image from 'next/image';
import Link from 'next/link';
import { CartDrawer } from '../cart/CartDrawer';

interface Category {
  id: string;
  name: string;
  slug: string;
  subCategories?: Category[];
}

interface HeaderProps {
  categories?: Category[];
}

export function Header({ categories = [] }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { getItemCount, toggleCart, isOpen } = useCartStore();
  const { organization } = useOrganization();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {organization?.logo && (
                    <Image
                      src={organization.logo}
                      alt={organization.name || 'Store Logo'}
                      width={40}
                      height={40}
                    />
                  )}
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.primary.main,
                      display: { xs: searchOpen ? 'none' : 'block', md: 'block' }
                    }}
                  >
                    {organization?.name || 'Furnerio'}
                  </Typography>
                </Box>
              </Link>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 3, flexGrow: 1, justifyContent: 'center' }}>
                <Button
                  component={Link}
                  href="/products"
                  color="inherit"
                  sx={{ fontWeight: 500 }}
                >
                  All Products
                </Button>
                {categories.slice(0, 4).map((category) => (
                  <Button
                    key={category.id}
                    component={Link}
                    href={`/category/${category.slug}`}
                    color="inherit"
                    sx={{ fontWeight: 500 }}
                  >
                    {category.name}
                  </Button>
                ))}
                <Button
                  component={Link}
                  href="/contact"
                  color="inherit"
                  sx={{ fontWeight: 500 }}
                >
                  Contact
                </Button>
              </Box>
            )}

            {/* Search Bar - Desktop */}
            {!isMobile && !searchOpen && (
              <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
                <form onSubmit={handleSearch}>
                  <TextField
                    fullWidth
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: 'action.active' }} />
                        </InputAdornment>
                      ),
                      sx: {
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none'
                        }
                      }
                    }}
                  />
                </form>
              </Box>
            )}

            {/* Mobile Search Bar */}
            {isMobile && searchOpen && (
              <Box sx={{ flexGrow: 1, mx: 2 }}>
                <form onSubmit={handleSearch}>
                  <TextField
                    fullWidth
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    autoFocus
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setSearchOpen(false)}>
                            <Close />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none'
                        }
                      }
                    }}
                  />
                </form>
              </Box>
            )}

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Mobile Search Toggle */}
              {isMobile && !searchOpen && (
                <IconButton
                  color="inherit"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search />
                </IconButton>
              )}

              {/* Wishlist */}
              <IconButton color="inherit" component={Link} href="/wishlist">
                <Favorite />
              </IconButton>

              {/* User Account */}
              <IconButton color="inherit" onClick={handleUserMenu}>
                <Person />
              </IconButton>

              {/* Shopping Cart */}
              <IconButton color="inherit" onClick={toggleCart}>
                <Badge badgeContent={getItemCount()} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            <ListItem component={Link} href="/products" onClick={() => setMobileMenuOpen(false)}>
              <ListItemText primary="All Products" />
            </ListItem>
            {categories.map((category) => (
              <ListItem
                key={category.id}
                component={Link}
                href={`/category/${category.slug}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemText primary={category.name} />
              </ListItem>
            ))}
            <ListItem component={Link} href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <ListItemText primary="Contact" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem component={Link} href="/profile" onClick={handleCloseUserMenu}>
          My Profile
        </MenuItem>
        <MenuItem component={Link} href="/orders" onClick={handleCloseUserMenu}>
          My Orders
        </MenuItem>
        <MenuItem component={Link} href="/auth/login" onClick={handleCloseUserMenu}>
          Login
        </MenuItem>
      </Menu>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
