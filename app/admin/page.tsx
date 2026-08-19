"use client";
import { useState, useEffect, useRef } from "react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products",
  );
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [catName, setCatName] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const resCats = await fetch("/api/categories");
    const resProds = await fetch("/api/products");
    setCategories(await resCats.json());
    setProducts(await resProds.json());
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: catName }),
    });
    setCatName("");
    fetchData();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", price: "", description: "", category: "" });
    setSelectedFile(null);
    setCurrentImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditClick = (p: any) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      price: p.price,
      description: p.description || "",
      category: p.category?._id || p.category || "",
    });
    setCurrentImageUrl(p.imageUrl || "");
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("description", form.description);
    data.append("category", form.category);

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      body: data,
    });

    resetForm();
    fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Sidebar Izquierdo */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-wide">
            Admin Panel
          </h1>
          <p className="text-xs text-slate-400 mt-1">Gestión de Tienda</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab("products");
              resetForm();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "products"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Productos
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "categories"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Categorías
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          Tienda Next.js v1.0
        </div>
      </aside>

      {/* Áreas de Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "products" && (
          <div className="max-w-5xl mx-auto space-y-8">
            <header className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Gestión de Productos
                </h2>
                <p className="text-sm text-gray-500">
                  Crea, edita o elimina artículos del catálogo
                </p>
              </div>
            </header>

            {/* Formulario de Producto */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingId ? "Editar Producto" : "Agregar Nuevo Producto"}
                </h3>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="text-xs text-gray-500 hover:text-gray-800 underline"
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>

              <form
                onSubmit={handleSubmitProduct}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Teclado Mecánico"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">Seleccionar Categoría</option>
                    {categories.map((c: any) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Imagen
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg text-xs bg-white file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-100 file:text-xs"
                  />
                  {currentImageUrl && !selectedFile && (
                    <span className="text-[11px] text-gray-400 mt-1 block truncate">
                      Actual: {currentImageUrl}
                    </span>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    placeholder="Detalles sobre el producto..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm h-20 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className={`col-span-2 py-2.5 rounded-lg text-white font-medium text-sm transition-colors ${
                    editingId
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {editingId ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </form>
            </section>

            {/* Tabla de Productos */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  Inventario
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b text-gray-500 uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-6">Producto</th>
                      <th className="py-3 px-6">Categoría</th>
                      <th className="py-3 px-6">Precio</th>
                      <th className="py-3 px-6 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p: any) => (
                      <tr key={p._id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-6 flex items-center gap-3">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                              Sin foto
                            </div>
                          )}
                          <span className="font-medium text-gray-900">
                            {p.name}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-gray-600">
                          {p.category?.name || "Sin Categoría"}
                        </td>
                        <td className="py-3 px-6 font-semibold text-gray-900">
                          ${p.price}
                        </td>
                        <td className="py-3 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="text-amber-600 hover:text-amber-800 font-medium text-xs px-2.5 py-1 bg-amber-50 rounded"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="text-red-600 hover:text-red-800 font-medium text-xs px-2.5 py-1 bg-red-50 rounded"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <header className="border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Categorías</h2>
              <p className="text-sm text-gray-500">
                Administra las categorías principales de la tienda
              </p>
            </header>

            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Nueva Categoría
              </h3>
              <form onSubmit={handleCreateCategory} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ej. Electrónica, Ropa, Hogar..."
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="flex-1 border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                >
                  Crear
                </button>
              </form>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  Categorías Existentes
                </h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {categories.map((c: any) => (
                  <li
                    key={c._id}
                    className="py-3.5 px-6 flex justify-between items-center text-sm font-medium text-gray-700"
                  >
                    <span>{c.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                      ID: {c._id}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
