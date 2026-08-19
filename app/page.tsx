"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function StoreFront() {
  const [cats, setCats] = useState<any[]>([]);
  const [prods, setProds] = useState<any[]>([]);
  const [selCat, setSelCat] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCats);
  }, []);
  useEffect(() => {
    fetch(selCat ? `/api/products?category=${selCat}` : "/api/products")
      .then((r) => r.json())
      .then(setProds);
  }, [selCat]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-slate-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Mi Tienda
          </span>
          <Link
            href="/admin"
            className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full transition-all shadow-sm"
          >
            Acceso Admin
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col gap-2">
          <span className="text-blue-400 font-semibold text-xs tracking-wider uppercase">
            Catálogo Exclusivo
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Descubre lo nuevo.
          </h1>
          <p className="text-slate-400 text-sm max-w-md mt-1">
            Explora nuestros productos seleccionados con la mejor calidad y
            envío directo.
          </p>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelCat("")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${!selCat ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
          >
            Todas
          </button>
          {cats.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelCat(c._id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selCat === c._id ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
            >
              {c.name}
            </button>
          ))}
        </nav>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {prods.map((p) => (
            <div
              key={p._id}
              className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <Link
                href={`/products/${p.slug}`}
                className="relative h-52 bg-slate-100 overflow-hidden block"
              >
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-medium text-slate-400">
                    Sin Imagen
                  </div>
                )}
                {p.category?.name && (
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                    {p.category.name}
                  </span>
                )}
              </Link>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <Link href={`/products/${p.slug}`}>
                    <h2 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {p.name}
                    </h2>
                  </Link>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {p.description || "Sin descripción disponible."}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Precio
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      ${p.price}
                    </span>
                  </div>
                  <Link
                    href={`/products/${p.slug}`}
                    className="bg-slate-900 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
