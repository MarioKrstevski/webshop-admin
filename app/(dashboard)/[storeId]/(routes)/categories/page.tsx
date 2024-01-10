import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { CategoryColumn } from "./components/Columns";
import CategoryClient from "./components/CategoryClient";
interface CategoriesPageProps {
  params: {
    storeId: string;
  };
}

export default async function CategoriesPage({
  params: { storeId },
}: CategoriesPageProps) {
  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map(
    (category) => {
      return {
        id: category.id,
        billboardLabel: category.billboard.label,
        name: category.name,
        createdAt: format(category.createdAt, "MMMM do, yyyy"),
      };
    }
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-2 p-8 pt-6">
        <CategoryClient categories={formattedCategories} />
      </div>
    </div>
  );
}
