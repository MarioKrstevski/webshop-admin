"use client";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { CategoryColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ApiList";
interface CategoryClientProps {
  categories: CategoryColumn[];
}

export default function CategoryClient({
  categories,
}: CategoryClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={"Categories (" + categories.length + ")"}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/categories/new`);
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
        data={categories}
      ></DataTable>
      <Heading
        title="API"
        description="Api calls for categories"
      ></Heading>
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
}
