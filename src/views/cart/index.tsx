"use client";

import EmptyCart from "@/sections/cart/empty-cart";
import { useState } from "react";

export default function CartView() {
  const [cart, setCart] = useState([
    {
      id: "1",
      name: "Product 1",
      quantity: 2,
      mrp: 450999,
      price: 439999,
    },
  ]);

  return (
    <div>
      <EmptyCart />
    </div>
  );
}
