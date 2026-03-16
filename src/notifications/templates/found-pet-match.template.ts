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
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6; max-width: 760px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7c2d12, #dc2626); color: white; padding: 28px; border-radius: 18px 18px 0 0;">
        <p style="margin: 0 0 8px 0; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.9;">PetRadar</p>
        <h1 style="margin: 0; font-size: 30px;">Posible coincidencia para ${lostPet.name}</h1>
        <p style="margin: 10px 0 0 0;">Se registró una mascota encontrada cerca del punto donde reportaste la perdida.</p>
      </div>

      <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 18px 18px; padding: 28px; background: #ffffff;">
        <div style="background: #fff7ed; border: 1px solid #fdba74; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
          <strong style="display: block; margin-bottom: 6px;">Distancia estimada</strong>
          <span>${distance} metros entre el punto perdido y el punto encontrado.</span>
        </div>

        <h2 style="margin-top: 0; color: #111827;">Mascota encontrada</h2>
        ${
          foundPet.photoUrl
            ? `<div style="margin: 0 0 20px 0;">
                <img src="${foundPet.photoUrl}" alt="Foto de la mascota encontrada" style="max-width: 100%; width: 100%; max-height: 320px; object-fit: cover; border-radius: 14px; border: 1px solid #e5e7eb;" />
              </div>`
            : ''
        }
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: 700;">Especie</td><td style="padding: 8px 0;">${foundPet.species}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Raza</td><td style="padding: 8px 0;">${foundPet.breed ?? 'No identificada'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Color</td><td style="padding: 8px 0;">${foundPet.color}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Tamano</td><td style="padding: 8px 0;">${foundPet.size}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Descripcion</td><td style="padding: 8px 0;">${foundPet.description}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Direccion</td><td style="padding: 8px 0;">${foundPet.address}</td></tr>
        </table>

        <h2 style="margin-top: 28px; color: #111827;">Contacto de quien la encontro</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: 700;">Nombre</td><td style="padding: 8px 0;">${foundPet.finderName}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Correo</td><td style="padding: 8px 0;">${foundPet.finderEmail}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Telefono</td><td style="padding: 8px 0;">${foundPet.finderPhone}</td></tr>
        </table>

        <h2 style="margin-top: 28px; color: #111827;">Tu reporte de mascota perdida</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: 700;">Nombre</td><td style="padding: 8px 0;">${lostPet.name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Especie</td><td style="padding: 8px 0;">${lostPet.species}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Raza</td><td style="padding: 8px 0;">${lostPet.breed ?? 'No especificada'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Color</td><td style="padding: 8px 0;">${lostPet.color}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Direccion</td><td style="padding: 8px 0;">${lostPet.address}</td></tr>
        </table>

        ${
          mapUrl
            ? `<div style="margin-top: 28px;">
                <h2 style="color: #111827;">Mapa de ubicaciones</h2>
                <img src="${mapUrl}" alt="Mapa de ubicaciones" style="max-width: 100%; border-radius: 14px; border: 1px solid #e5e7eb;" />
              </div>`
            : ''
        }
      </div>
    </div>
  `;
}
