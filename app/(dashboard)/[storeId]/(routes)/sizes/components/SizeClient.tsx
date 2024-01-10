"use client";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { SizeColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ApiList";
interface SizeClientProps {
  sizes: SizeColumn[];
}

export default function SizeClient({ sizes }: SizeClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={"Sizes (" + sizes.length + ")"}
          description="Manage sizes for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/sizes/new`);
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
        data={sizes}
      ></DataTable>
      <Heading
        title="API"
        description="Api calls for sizes"
      ></Heading>
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
}
