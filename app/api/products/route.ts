import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { saveImage } from "@/lib/fileStorage";

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category");

  const filter = categoryId ? { category: categoryId } : {};
  const products = await Product.find(filter).populate("category");
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await connectDB();
  const formData = await req.formData();

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const imageFile = formData.get("image") as File | null;

  const slug = `${createSlug(name)}-${Date.now().toString().slice(-4)}`;

  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveImage(imageFile);
  }

  const product = await Product.create({
    name,
    slug,
    price,
    description,
    category,
    imageUrl,
  });

  return NextResponse.json(product, { status: 201 });
}
