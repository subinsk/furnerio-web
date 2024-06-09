"use client";

import { useCallback, useState } from "react";
// @mui
import { alpha } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import CartIcon from "@/sections/product/common/cart-icon";
// routes
import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";
// components
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import { ProductDetailsSkeleton } from "@/sections/product/product-skeleton";
import { useGetProduct } from "@/services/product.service";
import ProductDetailsDescription from "@/sections/product/product-details-description";
import ProductDetailsReview from "@/sections/product/product-details-review";
import ProductDetailsCarousel from "@/sections/product/product-details-carousel";
import ProductDetailsSummary from "@/sections/product/product-details-summary";
import { useCheckoutContext } from "@/sections/checkout/context";

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: "100% Original",
    description: "Chocolate bar candy canes ice cream toffee cookie halvah.",
    icon: "solar:verified-check-bold",
  },
  {
    title: "10 Day Replacement",
    description: "Marshmallow biscuit donut dragée fruitcake wafer.",
    icon: "solar:clock-circle-bold",
  },
  {
    title: "Year Warranty",
    description: "Cotton candy gingerbread cake I love sugar sweet.",
    icon: "solar:shield-check-bold",
  },
];

// ----------------------------------------------------------------------

export default function ProductShopDetailsView({ slug }: { slug: string }) {
  const settings: any = useSettingsContext();

  const checkout: any = useCheckoutContext();

  const [currentTab, setCurrentTab] = useState("description");

  const {product,
            productLoading,
            productError,
            productValidating,
  } = useGetProduct({ slug });

  const handleChangeTab = useCallback((event: any, newValue: any) => {
    setCurrentTab(newValue);
  }, []);

  const renderSkeleton = <ProductDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${productError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.product.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderProduct = product && (
    <>
      <CustomBreadcrumbs
        links={[
          { name: "Home", href: "/" },
          {
            name: "Shop",
            href: paths.product.root,
          },
          { name: product?.name },
        ]}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel product={product} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <ProductDetailsSummary
            product={product}
            items={checkout.items}
            onAddCart={checkout.onAddToCart}
            onGotoStep={checkout.onGotoStep}
          />
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: "center", px: 5 }}>
            <Iconify
              icon={item.icon}
              width={32}
              sx={{ color: "primary.main" }}
            />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: "description",
              label: "Description",
            },
            {
              value: "reviews",
              label: `Reviews (${product?.reviews ? product.reviews.length : 0})`,
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === "description" && (
          <ProductDetailsDescription description={product?.description} />
        )}

        {currentTab === "reviews" && (
          <ProductDetailsReview
            ratings={product.ratings}
            reviews={product.reviews}
            totalRatings={product.totalRatings}
            totalReviews={product.totalReviews}
          />
        )}
      </Card>
    </>
  );

  return (
    <Container
      maxWidth={settings.themeStretch ? false : "lg"}
      sx={{
        mt: 5,
        mb: 15,
      }}
    >
      {/* <CartIcon totalItems={checkout.totalItems} /> */}

      {productLoading && renderSkeleton}

      {productError && renderError}

      {product && renderProduct}
    </Container>
  );
}
