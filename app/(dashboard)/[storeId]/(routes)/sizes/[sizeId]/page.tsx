import prismadb from "@/lib/prismadb";
import SizeForm from "./components/SizeForm";

export default async function SizePage({
  params,
}: {
  params: { sizeId: string };
}) {
  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  if (params.sizeId === "new") {
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialSize={size} />
      </div>
    </div>
  );
}
