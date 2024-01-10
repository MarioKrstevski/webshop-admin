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
    const { label, imageUrl } = body;

    if (!label) {
      return new NextResponse("Missing label, it's required", {
        status: 400,
      });
    }
    if (!imageUrl) {
      return new NextResponse("Missing image URL, it's required", {
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
    // make sure we dont allow someone else to upload things to our billboard
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", {
        status: 400,
      });
    }
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);

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
    const billboard = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}
