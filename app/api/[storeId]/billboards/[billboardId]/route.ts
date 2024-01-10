import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("billboardId, it's required", {
        status: 400,
      });
    }
    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
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

    if (!params.billboardId) {
      return new NextResponse("billboardId, it's required", {
        status: 400,
      });
    }
    const storeByUserId = await prismadb.store.findMany({
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

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
        // we might not need this?
        storeId: params.storeId,
      },
      data: {
        imageUrl,
        label,
      },
    });
    // make sure we dont allow someone else to upload things to our billboard

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.billboardId) {
      return new NextResponse("billboardId, it's required", {
        status: 400,
      });
    }
    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);

    return new NextResponse("Internall error", { status: 500 });
  }
}
