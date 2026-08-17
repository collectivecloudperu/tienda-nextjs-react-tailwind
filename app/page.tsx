"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function StoreFront() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    const url = selectedCategory
      ? `/api/products?category=${selectedCategory}`
      : "/api/products";
    fetch(url)
      .then((res) => res.json())
      .then(setProducts);
  }, [selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Mi Tienda</h1>
        <a
          href="/admin"
          className="text-sm bg-gray-900 text-white px-3 py-2 rounded"
        >
          Acceso Admin
        </a>
      </header>

      {/* Filtro de Categorías */}
      <nav className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === ""
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          Todas
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === cat._id
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </nav>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div
            key={product._id}
            className="border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <Link href={`/products/${product.slug}`}>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-48 w-full object-cover cursor-pointer"
                />
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  Sin Imagen
                </div>
              )}
            </Link>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs text-blue-600 font-semibold uppercase">
                  {product.category?.name}
                </span>
                <Link href={`/products/${product.slug}`}>
                  <h2 className="text-lg font-bold text-gray-900 hover:text-blue-600 cursor-pointer">
                    {product.name}
                  </h2>
                </Link>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-xl font-black">${product.price}</span>
                <Link
                  href={`/products/${product.slug}`}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
