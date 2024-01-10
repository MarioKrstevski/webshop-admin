import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ColorColumn } from "./components/Columns";
import ColorClient from "./components/ColorClient";
interface ColorPageProps {
  params: {
    storeId: string;
  };
}

export default async function ColorsPage({
  params: { storeId },
}: ColorPageProps) {
  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumn[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-2 p-8 pt-6">
        <ColorClient colors={formattedColors} />
      </div>
    </div>
  );
}
