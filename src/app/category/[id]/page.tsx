import { INITIAL_CATEGORIES } from "@/lib/data";
import CategoryClient from "./CategoryClient";

export function generateStaticParams() {
  return INITIAL_CATEGORIES.map((cat) => ({
    id: cat.id,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CategoryClient initialId={id} />;
}
