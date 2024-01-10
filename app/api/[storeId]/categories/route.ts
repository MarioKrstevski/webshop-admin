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
    const { name, billboardId } = body;

    if (!name) {
      return new NextResponse(
        "Missing category name, it's required",
        {
          status: 400,
        }
      );
    }
    if (!billboardId) {
      return new NextResponse("Missing billboardId, it's required", {
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
    // make sure we dont allow someone else to upload things to our category
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", {
        status: 400,
      });
    }
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);

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
    const category = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}
