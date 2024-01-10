import BillboardClient from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/BillboardClient";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { BillboardColumn } from "./components/Columns";
interface BillboardsPageProps {
  params: {
    storeId: string;
  };
}

export default async function BiilbaordsPage({
  params: { storeId },
}: BillboardsPageProps) {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(
    (billboard) => {
      return {
        id: billboard.id,
        label: billboard.label,
        createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
      };
    }
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-2 p-8 pt-6">
        <BillboardClient billboards={formattedBillboards} />
      </div>
    </div>
  );
}
