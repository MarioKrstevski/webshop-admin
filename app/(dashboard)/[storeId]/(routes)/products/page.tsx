import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ProductColumn } from "./components/Columns";
import { formatter } from "@/lib/utils";
import ProductClient from "./components/ProductClient";

interface ProductsPageProps {
  params: {
    storeId: string;
  };
}

export default async function ProductsPage({
  params,
}: ProductsPageProps) {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-2 p-8 pt-6">
        <ProductClient products={formattedProducts} />
      </div>
    </div>
  );
}
