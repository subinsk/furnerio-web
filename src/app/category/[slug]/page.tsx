import CategoryView from "@/views/category";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return <CategoryView slug={slug} />;
}
