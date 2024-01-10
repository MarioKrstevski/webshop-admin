import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("sizeId, it's required", {
        status: 400,
      });
    }
    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
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
    if (!value) {
      return new NextResponse("Missing value, it's required", {
        status: 400,
      });
    }

    if (!params.sizeId) {
      return new NextResponse("sizeId, it's required", {
        status: 400,
      });
    }
    const storeByUserId = await prismadb.store.findMany({
      where: {
        id: params.storeId,
        userId,
      },
    });
    // make sure we dont allow someone else to upload things to our size
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", {
        status: 400,
      });
    }

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
        // we might not need this?
        storeId: params.storeId,
      },
      data: {
        name,
        value,
      },
    });
    // make sure we dont allow someone else to upload things to our billboard

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_PATCH]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.sizeId) {
      return new NextResponse("sizeId, it's required", {
        status: 400,
      });
    }
    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_DELETE]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}
