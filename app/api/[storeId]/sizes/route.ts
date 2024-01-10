import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  console.log("POST", params);
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

    // make sure we dont allow someone else to upload things to our size
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", {
        status: 400,
      });
    }
    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZES_POST]", error);

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
    const size = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZES_GET]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}
