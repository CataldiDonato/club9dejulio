const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CONFIGS = {
  profile: {
    width: 400,
    height: 400,
    fit: 'cover',
    quality: 70
  },
  gallery: {
    width: 1200,
    fit: 'inside', // maintain aspect ratio, max width
    quality: 85
  }
};

/**
 * Procesa una imagen según la configuración especificada.
 * @param {Buffer|string} input - Buffer de la imagen o ruta al archivo.
 * @param {'profile'|'gallery'} configName - Nombre de la configuración ('profile' o 'gallery').
 * @returns {Promise<Buffer>} - Buffer de la imagen procesada en formato WebP.
 */
async function optimizeImage(input, configName) {
  const config = CONFIGS[configName];
  if (!config) {
    throw new Error(`Configuración desconocida: ${configName}`);
  }

  try {
    let pipeline = sharp(input);

    // Configuración específica
    if (configName === 'profile') {
      pipeline = pipeline.resize({
        width: config.width,
        height: config.height,
        fit: config.fit,
      });
    } else if (configName === 'gallery') {
      // Para galería solo limitamos el ancho máximo, manteniendo aspecto
      pipeline = pipeline.resize({
        width: config.width,
        withoutEnlargement: true, // No agrandar si es más chica
        fit: config.fit
      });
    }

    // Convertir a WebP con la calidad deseada
    return await pipeline
      .webp({ quality: config.quality })
      .toBuffer();

  } catch (error) {
    console.error('Error optimizando imagen:', error);
    throw error;
  }
}

/**
 * Helper para guardar el buffer optimizado en disco y borrar el original si es necesario.
 * @param {Buffer} buffer - El buffer de la imagen optimizada.
 * @param {string} originalPath - Ruta del archivo original (para borrarlo) o directorio destino.
 * @param {boolean} deleteOriginal - Si se debe borrar el archivo original después de guardar el nuevo.
 * @returns {Promise<string>} - Ruta relativa del nuevo archivo guardado (e.g., '/uploads/image.webp').
 */
async function saveOptimizedImage(buffer, originalPath, deleteOriginal = true) {
  try {
      // Determinar directorio y nombre base
      const dir = path.dirname(originalPath);
      const ext = path.extname(originalPath);
      const name = path.basename(originalPath, ext);
      
      // Nuevo nombre con extensión .webp
      const newFilename = `${name}.webp`;
      const newPath = path.join(dir, newFilename);

      // Guardar el archivo optimizado
      await fs.promises.writeFile(newPath, buffer);

      // Borrar el original si se solicita y si es diferente al nuevo (por si acaso)
      if (deleteOriginal && originalPath !== newPath && fs.existsSync(originalPath)) {
          await fs.promises.unlink(originalPath);
      }

      // Retornar ruta relativa para guardar en DB (asumiendo estructura 'uploads/')
      // Ajustar esto según la estructura de carpetas de tu servidor
      // En tu caso parece ser que guardas todo en 'uploads' relativo al root del server
      return `/uploads/${newFilename}`;
  } catch (error) {
      console.error('Error guardando imagen optimizada:', error);
      throw error;
  }
}

module.exports = {
  optimizeImage,
  saveOptimizedImage
};
