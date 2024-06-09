import CategoryView from "@/views/category";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  if(!slug) return null;

  return <CategoryView slug={slug } />;
}
