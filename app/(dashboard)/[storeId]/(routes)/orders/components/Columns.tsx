"use client";

import { ColumnDef } from "@tanstack/react-table";

export type OrderColumn = {
  id: string;
  createdAt: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
