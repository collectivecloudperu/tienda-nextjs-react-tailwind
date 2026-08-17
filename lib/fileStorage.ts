// lib/fileStorage.ts
import { writeFile, unlink } from "fs/promises";
import path from "path";

/**
 * Guarda una imagen en public/uploads y retorna la URL relativa.
 */
export async function saveImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileExtension = path.extname(file.name);
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

/**
 * Elimina la imagen del disco local dada su URL relativa.
 */
export async function deleteImage(imageUrl?: string) {
  if (!imageUrl || !imageUrl.includes("uploads/")) return;

  try {
    // Extraer únicamente el nombre del archivo sin importar el formato de barra
    const fileName = imageUrl.split("/").pop();
    if (!fileName) return;

    const filePath = path.join(process.cwd(), "public", "uploads", fileName);
    await unlink(filePath);
    console.log(`Imagen eliminada correctamente: ${fileName}`);
  } catch (error) {
    console.warn(`No se pudo eliminar el archivo previo (${imageUrl}):`, error);
  }
}
