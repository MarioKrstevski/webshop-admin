import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { OrderColumn } from "./components/Columns";
import { formatter } from "@/lib/utils";
import { OrderItem } from "@prisma/client";
import OrderClient from "./components/OrderClient";
interface OrdersPageProps {
  params: {
    storeId: string;
  };
}

export default async function OrdersPage({
  params: { storeId },
}: OrdersPageProps) {
  const orders = await prismadb.order.findMany({
    where: {
      storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => {
    return {
      id: order.id,
      isPaid: order.isPaid,
      phone: order.phone,
      address: order.address,
      products: order.orderItems
        .map((order) => order.product.name)
        .join(", "),

      totalPrice: formatter.format(
        order.orderItems.reduce((total, item) => {
          return total + Number(item.product.price);
        }, 0)
      ),
      createdAt: format(order.createdAt, "MMMM do, yyyy"),
    };
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-2 p-8 pt-6">
        <OrderClient orders={formattedOrders} />
      </div>
    </div>
  );
}
