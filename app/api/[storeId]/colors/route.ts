import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
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

    if (!params.storeId) {
      return new NextResponse("StoreId, it's required", {
        status: 400,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
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
    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLORS_POST]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("StoreId, it's required", {
        status: 400,
      });
    }
    const color = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLORS_GET]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}
