"use client";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { ProductColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ApiList";
interface ProductClientProps {
  products: ProductColumn[];
}

export default function ProductClient({
  products,
}: ProductClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={"Products (" + products.length + ")"}
          description="Manage products for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/products/new`);
          }}
        >
          <PlusIcon className="w-4 h-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={products}
      ></DataTable>
      <Heading
        title="API"
        description="Api calls for products"
      ></Heading>
      <Separator />
      <ApiList entityName="products" entityIdName="productsId" />
    </>
  );
}
