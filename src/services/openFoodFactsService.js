/**
 * Servicio para consultar la API pública de Open Food Facts.
 * Busca información de productos a partir de su código de barras.
 * 
 * Documentación: https://openfoodfacts.github.io/openfoodfacts-server/api/
 * Endpoint: https://world.openfoodfacts.org/api/v2/product/{barcode}.json
 */

const API_BASE = 'https://world.openfoodfacts.org/api/v2';

/**
 * Resultado de la búsqueda de un producto por código de barras.
 *
 * @typedef {Object} BarcodeResult
 * @property {boolean} encontrado - Indica si se encontró el producto
 * @property {Object|null} producto - Datos del producto mapeados
 * @property {string} producto.nombre - Nombre del producto
 * @property {string} producto.codigoBarras - Código de barras
 * @property {number|null} producto.pesoUnidad - Peso por unidad en kg (inferido)
 * @property {string|null} producto.imagen - URL de la imagen del producto
 * @property {string|null} producto.marca - Marca del producto
 * @property {string|null} producto.cantidadTexto - Texto raw de cantidad (ej. "1 kg")
 * @property {string|null} error - Mensaje de error si algo falla
 */

/**
 * Busca un producto en Open Food Facts por su código de barras.
 *
 * @param {string} barcode - Código de barras del producto
 * @returns {Promise<BarcodeResult>}
 *
 * @example
 * const result = await buscarPorCodigoBarras('7501234567890');
 * if (result.encontrado) {
 *   console.log(result.producto.nombre);
 * }
 */
export async function buscarPorCodigoBarras(barcode) {
  // Validar que el código no esté vacío
  if (!barcode || !barcode.trim()) {
    return {
      encontrado: false,
      producto: null,
      error: 'Ingresa un código de barras',
    };
  }

  const codigoLimpio = barcode.trim();

  try {
    const response = await fetch(
      `${API_BASE}/product/${codigoLimpio}.json`,
      {
        headers: {
          'User-Agent': 'Lumera - App de trazabilidad de donaciones - v1.0',
        },
      }
    );

    if (!response.ok) {
      return {
        encontrado: false,
        producto: null,
        error: `Error al consultar API (${response.status})`,
      };
    }

    const data = await response.json();

    // status === 1 significa que el producto fue encontrado
    if (data.status !== 1 || !data.product) {
      return {
        encontrado: false,
        producto: null,
        error: null, // No es un error, simplemente no se encontró
      };
    }

    const product = data.product;

    // Inferir peso en kg desde el campo "quantity" (ej. "1 kg", "500 g", "2 L")
    const pesoKg = inferirPesoEnKg(product.quantity);

    return {
      encontrado: true,
      producto: {
        nombre: product.product_name_es || product.product_name || 'Producto sin nombre',
        codigoBarras: product.code || codigoLimpio,
        pesoUnidad: pesoKg,
        imagen: product.image_url || product.image_small_url || null,
        marca: product.brands || null,
        cantidadTexto: product.quantity || null,
        // Guardamos también datos raw por si se necesitan
        categorias: product.categories || null,
        nutriScore: product.nutrition_grades || null,
      },
      error: null,
    };
  } catch (err) {
    console.error('[OpenFoodFacts] Error en la consulta:', err);
    return {
      encontrado: false,
      producto: null,
      error: 'Error de conexión. Verifica tu internet e intenta de nuevo.',
    };
  }
}

/**
 * Intenta inferir el peso en kilogramos desde un texto como "1 kg", "500 g", "2 L", etc.
 *
 * @param {string|null} quantityText - Texto raw de cantidad (ej. "1 kg")
 * @returns {number|null} Peso en kg o null si no se puede inferir
 */
function inferirPesoEnKg(quantityText) {
  if (!quantityText) return null;

  const texto = quantityText.toString().toLowerCase().trim();

  // Patrones: "1 kg", "1kg", "1.5 kg", "500 g", "2 l", "2l", "1000 ml", "750ml"
  const match = texto.match(/^([\d.,]+)\s*(kg|kilo|kilogramo|g|gr|gramo|ml|mililitro|l|litro)$/);

  if (!match) return null;

  let valor = parseFloat(match[1].replace(',', '.'));
  const unidad = match[2];

  if (isNaN(valor) || valor <= 0) return null;

  // Convertir a kg
  if (['g', 'gr', 'gramo'].includes(unidad)) {
    return Math.round((valor / 1000) * 100) / 100; // redondear a 2 decimales
  }

  if (['ml', 'mililitro'].includes(unidad)) {
    return Math.round((valor / 1000) * 100) / 100;
  }

  // kg, l, litro — ya está en kg (o asumimos 1L = 1kg para líquidos)
  return Math.round(valor * 100) / 100;
}
