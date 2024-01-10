"use client";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { BillboardColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ApiList";
interface BillboardClientProps {
  billboards: BillboardColumn[];
}

export default function BillboardClient({
  billboards,
}: BillboardClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={"Bilboards (" + billboards.length + ")"}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/billboards/new`);
          }}
        >
          <PlusIcon className="w-4 h-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="label"
        columns={columns}
        data={billboards}
      ></DataTable>
      <Heading
        title="API"
        description="Api calls for billboards"
      ></Heading>
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
}
