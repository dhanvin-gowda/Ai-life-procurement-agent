import { NextRequest, NextResponse } from "next/server";
import { cart, connectDB, CartItemDocument, CartPriceSnapshot } from "@/src/lib/database";
import { getAuthenticatedUserEmail } from "@/src/lib/auth";

function quantityIsValid(quantity: unknown): quantity is string | number {
  const value = Number(quantity);
  return Number.isFinite(value) && value > 0 && value <= 100000;
}

function priceIsValid(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function toPriceSnapshot(value: unknown): CartPriceSnapshot | undefined {
  if (!value || typeof value !== "object") return undefined;
  const snapshot = value as Record<string, unknown>;
  if (
    typeof snapshot.storeId !== "string" ||
    typeof snapshot.storeName !== "string" ||
    !priceIsValid(snapshot.unitPrice) ||
    !priceIsValid(snapshot.totalItemPrice)
  ) {
    return undefined;
  }

  return {
    storeId: snapshot.storeId,
    storeName: snapshot.storeName,
    unitPrice: snapshot.unitPrice,
    totalItemPrice: snapshot.totalItemPrice,
    ...(priceIsValid(snapshot.mrp) ? { mrp: snapshot.mrp } : {}),
    ...(typeof snapshot.deeplink === "string" ? { deeplink: snapshot.deeplink } : {}),
    isLivePrice: snapshot.isLivePrice === true,
    capturedAt: new Date(),
  };
}

export async function GET() {
  const email = await getAuthenticatedUserEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const existingCart = await cart.findOne({ userEmail: email }).lean();
    return NextResponse.json({ items: existingCart?.items || [] });
  } catch (error) {
    console.error("Cart read error:", error);
    return NextResponse.json({ error: "Cart is temporarily unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const email = await getAuthenticatedUserEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const product = body.product;
    if (!product || typeof product.id !== "string" || !quantityIsValid(body.quantity)) {
      return NextResponse.json({ error: "Product and valid quantity are required" }, { status: 400 });
    }

    await connectDB();
    const existingCart = await cart.findOne({ userEmail: email });
    const incomingQuantity = Number(body.quantity);
    const existingItem = existingCart?.items.find(
      (item: CartItemDocument) => item.productId === product.id
    );

    if (existingItem) {
      existingItem.quantity = String(Number(existingItem.quantity) + incomingQuantity);
      existingItem.priceSnapshot = undefined;
    } else {
      const item: CartItemDocument = {
        productId: product.id,
        product,
        quantity: String(incomingQuantity),
        addedAt: new Date(),
      };
      if (existingCart) existingCart.items.push(item);
      else await cart.create({ userEmail: email, items: [item] });
    }

    if (existingCart) await existingCart.save();
    const savedCart = await cart.findOne({ userEmail: email }).lean();
    return NextResponse.json({ items: savedCart?.items || [] });
  } catch (error) {
    console.error("Cart add error:", error);
    return NextResponse.json({ error: "Cart is temporarily unavailable" }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  const email = await getAuthenticatedUserEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    await connectDB();
    const existingCart = await cart.findOne({ userEmail: email });
    const item = existingCart?.items.find(
      (entry: CartItemDocument) => entry.productId === body.productId
    );
    if (!existingCart || !item) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });

    if (body.quantity !== undefined) {
      if (!quantityIsValid(body.quantity)) return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
      item.quantity = String(body.quantity);
      item.priceSnapshot = undefined;
    }
    if (body.priceSnapshot !== undefined) item.priceSnapshot = toPriceSnapshot(body.priceSnapshot);

    await existingCart.save();
    return NextResponse.json({ items: existingCart.items });
  } catch (error) {
    console.error("Cart update error:", error);
    return NextResponse.json({ error: "Cart is temporarily unavailable" }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  const email = await getAuthenticatedUserEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json().catch(() => ({}));
    await connectDB();
    const existingCart = await cart.findOne({ userEmail: email });
    if (!existingCart) return NextResponse.json({ items: [] });

    existingCart.items = body.productId
      ? existingCart.items.filter(
          (item: CartItemDocument) => item.productId !== body.productId
        )
      : [];
    await existingCart.save();
    return NextResponse.json({ items: existingCart.items });
  } catch (error) {
    console.error("Cart delete error:", error);
    return NextResponse.json({ error: "Cart is temporarily unavailable" }, { status: 503 });
  }
}