"use client";
import { useState, useEffect, useRef } from "react";

export default function AdminPage() {
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
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("description", form.description);
    data.append("category", form.category);

    // Solo adjuntar si el usuario seleccionó un archivo nuevo
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
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">Panel de Administración</h1>

      {/* Crear Categoría */}
      <section className="bg-gray-50 p-4 rounded-lg border">
        <h2 className="text-xl font-semibold mb-3">Nueva Categoría</h2>
        <form onSubmit={handleCreateCategory} className="flex gap-3">
          <input
            type="text"
            placeholder="Nombre de categoría"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Crear
          </button>
        </form>
      </section>

      {/* Formulario Crear / Editar Producto */}
      <section className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">
            {editingId ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-sm text-gray-500 underline"
            >
              Cancelar Edición
            </button>
          )}
        </div>

        <form onSubmit={handleSubmitProduct} className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
            required
          >
            <option value="">Seleccionar Categoría</option>
            {categories.map((c: any) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Input de archivo de imagen */}
          <div className="flex flex-col">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="border p-2 rounded bg-white text-sm"
            />
            {currentImageUrl && !selectedFile && (
              <span className="text-xs text-gray-500 mt-1">
                Imagen actual: {currentImageUrl}
              </span>
            )}
          </div>

          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded col-span-2"
          />

          <button
            type="submit"
            className={`p-2 rounded col-span-2 text-white font-medium ${
              editingId ? "bg-amber-600" : "bg-green-600"
            }`}
          >
            {editingId ? "Actualizar Producto" : "Guardar Producto"}
          </button>
        </form>
      </section>

      {/* Lista de Productos */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Inventario Actual</h2>
        <div className="divide-y">
          {products.map((p: any) => (
            <div key={p._id} className="py-3 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-semibold">
                    {p.name} - ${p.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    Categoría: {p.category?.name || "Sin categoría"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(p)}
                  className="bg-amber-500 text-white px-3 py-1 rounded text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
