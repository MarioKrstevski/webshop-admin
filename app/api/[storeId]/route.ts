import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    const body = await req.json();
    const { name, value } = body;

    if (!name) {
      return new NextResponse("Missing name, it's required", {
        status: 400,
      });
    }
    if (!params.storeId) {
      return new NextResponse("Missing storesId, it's required", {
        status: 400,
      });
    }
    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Internall error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storesId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storesId) {
      return new NextResponse("Missing storesId, it's required", {
        status: 400,
      });
    }
    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storesId,
        userId,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internall error", { status: 500 });
  }
}
