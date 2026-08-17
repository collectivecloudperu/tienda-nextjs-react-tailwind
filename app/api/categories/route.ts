import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  await connectDB();
  const categories = await Category.find({});
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  await connectDB();
  const { name } = await req.json();
  const slug = name.toLowerCase().replace(/ /g, "-");

  const category = await Category.create({ name, slug });
  return NextResponse.json(category, { status: 201 });
}
