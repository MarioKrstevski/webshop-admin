import BillboardClient from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/BillboardClient";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { SizeColumn } from "./components/Columns";
import SizeClient from "./components/SizeClient";
interface SizePageProps {
  params: {
    storeId: string;
  };
}

export default async function BiilbaordsPage({
  params: { storeId },
}: SizePageProps) {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-2 p-8 pt-6">
        <SizeClient sizes={formattedSizes} />
      </div>
    </div>
  );
}
