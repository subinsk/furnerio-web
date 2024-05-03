"use client";

import { forwardRef } from "react";
// icons
import { Icon } from "@iconify/react";
// @mui
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

const Iconify = forwardRef(
  (
    {
      icon,
      width = 20,
      sx,
      ...other
    }: { icon: string; width?: number; sx?: object; [key: string]: any },
    ref
  ) => (
    <Box
      ref={ref}
      component={Icon}
      className="component-iconify"
      icon={icon}
      sx={{ width, height: width, ...sx }}
      {...other}
    />
  )
);

Iconify.displayName = "Iconify";

export default Iconify;
