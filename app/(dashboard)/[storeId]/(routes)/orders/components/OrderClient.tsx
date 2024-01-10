"use client";
import Heading from "@/components/Heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/data-table";
interface OrderClientProps {
  orders: OrderColumn[];
}

export default function OrderClient({ orders }: OrderClientProps) {
  return (
    <>
      <Heading
        title={"Orders (" + orders.length + ")"}
        description="View orders for your store"
      />
      <Separator />
      <DataTable
        searchKey="products"
        columns={columns}
        data={orders}
      ></DataTable>
    </>
  );
}
