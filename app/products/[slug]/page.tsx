import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    await connectDB();
    // Forzamos el registro del modelo Category antes de hacer populate
    if (!Category) {
    }

    const product = await Product.findOne({ slug }).populate("category");
    if (!product) return null;

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Link href="/" className="text-sm text-gray-500 hover:text-black">
        ← Volver a la tienda
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* Imagen del producto */}
        <div className="bg-gray-100 rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          ) : (
            <span className="text-gray-400">Sin Imagen</span>
          )}
        </div>

        {/* Información del producto */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase">
              {product.category?.name || "General"}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              {product.name}
            </h1>
            <p className="text-2xl font-black text-gray-900 mt-2">
              ${product.price}
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed">
              {product.description}
            </p>
          </div>

          <button className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition">
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
