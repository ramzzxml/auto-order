import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stocks = await prisma.productStock.findMany({
      where: { productId: params.id },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ stocks });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 });
  }
}

// Body: { content: string } — one item per line, blank lines ignored.
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const content: string = body?.content ?? "";

    const lines = content
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 0);

    if (lines.length === 0) {
      return NextResponse.json({ error: "No stock content provided" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.productStock.createMany({
      data: lines.map((line: string) => ({
        productId: params.id,
        content: line
      }))
    });

    return NextResponse.json({ success: true, added: lines.length }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add stock" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stockId = searchParams.get("stockId");
    if (!stockId) {
      return NextResponse.json({ error: "stockId is required" }, { status: 400 });
    }
    await prisma.productStock.delete({ where: { id: stockId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete stock item" }, { status: 500 });
  }
}
