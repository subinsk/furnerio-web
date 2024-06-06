import ProductView from "@/views/product";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return <ProductView id={id} />;
}
