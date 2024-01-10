import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("colorId, it's required", {
        status: 400,
      });
    }
    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_GET]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
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

    if (!params.colorId) {
      return new NextResponse("colorId, it's required", {
        status: 400,
      });
    }
    const storeByUserId = await prismadb.store.findMany({
      where: {
        id: params.storeId,
        userId,
      },
    });
    // make sure we dont allow someone else to upload things to our color
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", {
        status: 400,
      });
    }

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
        // we might not need this?
        storeId: params.storeId,
      },
      data: {
        name,
        value,
      },
    });
    // make sure we dont allow someone else to upload things to our billboard

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_PATCH]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.colorId) {
      return new NextResponse("colorId, it's required", {
        status: 400,
      });
    }
    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_DELETE]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}
