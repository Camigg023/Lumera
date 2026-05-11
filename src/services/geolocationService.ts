/**
 * Servicio de geolocalización para encontrar el centro de acopio más cercano.
 * Usa la API de Geolocalización del navegador y el cálculo de distancia Haversine.
 */

/**
 * Calcula la distancia en kilómetros entre dos coordenadas usando la fórmula de Haversine.
 *
 * @param lat1 - Latitud del punto 1
 * @param lon1 - Longitud del punto 1
 * @param lat2 - Latitud del punto 2
 * @param lon2 - Longitud del punto 2
 * @returns Distancia en kilómetros
 */
export function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Obtiene la posición actual del usuario mediante la API de Geolocalización del navegador.
 *
 * @returns Promesa con { lat, lng } o null si no hay permisos/soporte
 */
export async function obtenerUbicacionActual(): Promise<{ lat: number; lng: number } | null> {
  if (!navigator.geolocation) {
    console.warn('[Geo] Geolocalización no soportada por el navegador');
    return null;
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1 minuto de caché
      });
    });

    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  } catch (err: any) {
    // Errores comunes:
    // 1: PERMISSION_DENIED - El usuario denegó el permiso
    // 2: POSITION_UNAVAILABLE - No se pudo determinar la posición
    // 3: TIMEOUT - La solicitud tardó demasiado
    console.warn('[Geo] Error al obtener ubicación:', err.code, err.message);
    return null;
  }
}

/**
 * Interfaz para un punto de acopio con distancia calculada.
 */
export interface PuntoAcopioConDistancia {
  id: string;
  nombre: string;
  direccion: string;
  distrito: string;
  coordenadas: { lat: number; lng: number };
  distanciaKm: number;
  estado: 'active' | 'high_demand' | 'inactive';
}

/**
 * Encuentra el punto de acopio más cercano desde una ubicación dada.
 *
 * @param ubicacion - Coordenadas del usuario { lat, lng }
 * @param puntos - Lista de puntos de acopio disponibles
 * @returns El punto más cercano con distancia calculada, o null si la lista está vacía
 */
export function encontrarMasCercano(
  ubicacion: { lat: number; lng: number },
  puntos: { id: string; name: string; address: string; district: string; coordinates: { lat: number; lng: number }; status: string }[]
): PuntoAcopioConDistancia | null {
  if (puntos.length === 0) return null;

  const puntosConDistancia = puntos.map((p) => ({
    id: p.id,
    nombre: p.name,
    direccion: p.address,
    distrito: p.district,
    coordenadas: p.coordinates,
    distanciaKm: Math.round(
      calcularDistancia(ubicacion.lat, ubicacion.lng, p.coordinates.lat, p.coordinates.lng) * 10
    ) / 10,
    estado: p.status as 'active' | 'high_demand' | 'inactive',
  }));

  puntosConDistancia.sort((a, b) => a.distanciaKm - b.distanciaKm);

  return puntosConDistancia[0];
}
