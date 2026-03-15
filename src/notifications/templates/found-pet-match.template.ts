import { FoundPet } from 'src/found-pets/found-pet.entity';
import { LostPetMatch } from '../types/lost-pet-match.type';

function buildStaticMapUrl(lostPet: LostPetMatch, foundPet: FoundPet, mapboxToken: string) {
  if (!mapboxToken) {
    return '';
  }

  const [foundLng, foundLat] = foundPet.location.coordinates;
  const pointRegex = /POINT\((-?\d+(\.\d+)?) (-?\d+(\.\d+)?)\)/;
  const lostPoint = pointRegex.exec(lostPet.location);

  if (!lostPoint) {
    return '';
  }

  const lostLng = lostPoint[1];
  const lostLat = lostPoint[3];

  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-l+f43f5e(${lostLng},${lostLat}),pin-s-r+1d4ed8(${foundLng},${foundLat})/auto/700x400?access_token=${mapboxToken}`;
}

export function generateFoundPetMatchTemplate(
  lostPet: LostPetMatch,
  foundPet: FoundPet,
  mapboxToken: string,
): string {
  const mapUrl = buildStaticMapUrl(lostPet, foundPet, mapboxToken);
  const distance = Number(lostPet.distance).toFixed(2);

  return `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
      <h1 style="color: #111827;">Coincidencia encontrada en PetRadar</h1>
      <p>Se registró una mascota encontrada cerca de una mascota perdida activa.</p>

      <h2 style="margin-top: 24px;">Mascota perdida</h2>
      <ul>
        <li><strong>Nombre:</strong> ${lostPet.name}</li>
        <li><strong>Especie:</strong> ${lostPet.species}</li>
        <li><strong>Raza:</strong> ${lostPet.breed ?? 'No especificada'}</li>
        <li><strong>Color:</strong> ${lostPet.color}</li>
        <li><strong>Tamano:</strong> ${lostPet.size}</li>
        <li><strong>Direccion:</strong> ${lostPet.address}</li>
      </ul>

      <h2 style="margin-top: 24px;">Mascota encontrada</h2>
      <ul>
        <li><strong>Especie:</strong> ${foundPet.species}</li>
        <li><strong>Raza:</strong> ${foundPet.breed ?? 'No identificada'}</li>
        <li><strong>Color:</strong> ${foundPet.color}</li>
        <li><strong>Tamano:</strong> ${foundPet.size}</li>
        <li><strong>Descripcion:</strong> ${foundPet.description}</li>
        <li><strong>Direccion:</strong> ${foundPet.address}</li>
        <li><strong>Distancia aproximada:</strong> ${distance} metros</li>
      </ul>

      <h2 style="margin-top: 24px;">Contacto de quien la encontro</h2>
      <ul>
        <li><strong>Nombre:</strong> ${foundPet.finderName}</li>
        <li><strong>Correo:</strong> ${foundPet.finderEmail}</li>
        <li><strong>Telefono:</strong> ${foundPet.finderPhone}</li>
      </ul>

      ${
        mapUrl
          ? `<div style="margin-top: 24px;">
              <h2>Mapa</h2>
              <img src="${mapUrl}" alt="Mapa de ubicaciones" style="max-width: 100%; border-radius: 12px;" />
            </div>`
          : ''
      }
    </div>
  `;
}
