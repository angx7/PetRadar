import { FoundPet } from 'src/found-pets/found-pet.entity';

export function generateFoundPetAlertTemplate(foundPet: FoundPet): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6; max-width: 720px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0f172a, #1d4ed8); color: white; padding: 24px; border-radius: 16px 16px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Nuevo reporte en PetRadar</h1>
        <p style="margin: 8px 0 0 0;">Se registró una mascota encontrada sin coincidencias cercanas en este momento.</p>
      </div>

      <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; padding: 24px; background: #ffffff;">
        <h2 style="margin-top: 0; color: #111827;">Datos de la mascota encontrada</h2>
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

        <h2 style="margin-top: 24px; color: #111827;">Contacto de quien la encontro</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: 700;">Nombre</td><td style="padding: 8px 0;">${foundPet.finderName}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Correo</td><td style="padding: 8px 0;">${foundPet.finderEmail}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Telefono</td><td style="padding: 8px 0;">${foundPet.finderPhone}</td></tr>
        </table>

        <p style="margin-top: 24px; color: #4b5563;">
          No se encontraron mascotas perdidas activas dentro de un radio de 500 metros al momento del registro.
        </p>
      </div>
    </div>
  `;
}
