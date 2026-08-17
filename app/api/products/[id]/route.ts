import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { saveImage, deleteImage } from "@/lib/fileStorage";

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// EDITAR PRODUCTO (PUT)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params; // <-- Await de params para resolver el ID
  const formData = await req.formData();

  const existingProduct = await Product.findById(id);
  if (!existingProduct) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 },
    );
  }

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const imageFile = formData.get("image") as File | null;

  let imageUrl = existingProduct.imageUrl;

  // Solo si se selecciona una imagen nueva y válida
  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    // 1. Eliminamos la imagen antigua
    await deleteImage(existingProduct.imageUrl);
    // 2. Guardamos la nueva
    imageUrl = await saveImage(imageFile);
  }

  if (name !== existingProduct.name) {
    existingProduct.slug = `${createSlug(name)}-${Date.now().toString().slice(-4)}`;
  }

  existingProduct.name = name;
  existingProduct.price = price;
  existingProduct.description = description;
  existingProduct.category = category;
  existingProduct.imageUrl = imageUrl;

  await existingProduct.save();

  return NextResponse.json(existingProduct);
}

// ELIMINAR PRODUCTO (DELETE)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params; // <-- Await de params para resolver el ID

  const product = await Product.findByIdAndDelete(id);

  if (product && product.imageUrl) {
    // Eliminamos el archivo físico del disco
    await deleteImage(product.imageUrl);
  }

  return NextResponse.json({
    message: "Producto e imagen eliminados con éxito",
  });
}
