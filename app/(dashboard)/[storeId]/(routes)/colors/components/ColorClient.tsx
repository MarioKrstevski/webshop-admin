"use client";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { ColorColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ApiList";
interface ColorClientProps {
  colors: ColorColumn[];
}

export default function ColorClient({ colors }: ColorClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={"Colors (" + colors.length + ")"}
          description="Manage colors for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/colors/new`);
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
        data={colors}
      ></DataTable>
      <Heading
        title="API"
        description="Api calls for colors"
      ></Heading>
      <Separator />
      <ApiList entityName="colors" entityIdName="colors" />
    </>
  );
}
