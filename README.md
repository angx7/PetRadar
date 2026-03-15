# PetRadar

API REST desarrollada con NestJS para registrar mascotas perdidas y mascotas encontradas. Cuando se registra una mascota encontrada, el sistema busca automaticamente mascotas perdidas activas dentro de un radio de 500 metros usando PostGIS y envia una notificacion por correo con un mapa estatico de Mapbox.

## Stack

- NestJS
- TypeORM
- PostgreSQL + PostGIS
- Nodemailer
- Mapbox Static Images API

## Funcionalidades

- Registrar mascotas perdidas en `POST /api/lost-pets`
- Registrar mascotas encontradas en `POST /api/found-pets`
- Buscar mascotas perdidas activas dentro de un radio de 500 metros
- Enviar correo a un correo generico cuando existe una coincidencia cercana

## Estructura principal

- `src/lost-pets/`: modulo de mascotas perdidas
- `src/found-pets/`: modulo de mascotas encontradas
- `src/notifications/`: envio de correos y templates
- `src/database/`: configuracion de TypeORM y migraciones
- `src/config/`: variables de entorno

## Requisitos

- Node.js 20+
- npm
- Docker y Docker Compose

## Variables de entorno

Crea un archivo `.env` en la raiz del proyecto.

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=petradar
MAILER_EMAIL=
MAILER_PASSWORD=
MAILER_SERVICE=
MAPBOX_TOKEN=
ALERT_EMAIL=
```

Descripcion rapida:

- `MAILER_EMAIL`: correo desde el que se enviaran las notificaciones
- `MAILER_PASSWORD`: password o app password del proveedor
- `MAILER_SERVICE`: proveedor de Nodemailer, por ejemplo `gmail`
- `MAPBOX_TOKEN`: token de Mapbox para el mapa estatico
- `ALERT_EMAIL`: correo generico que recibira las coincidencias

## Levantar base de datos

```bash
docker compose up -d
```

El contenedor usa:

- Host: `localhost`
- Puerto: `5432`
- Base de datos: `petradar`
- Usuario: `postgres`
- Password: `postgres`

## Instalacion

```bash
npm install
```

## Migraciones

Compilar proyecto y ejecutar CLI de TypeORM:

```bash
npm run typeorm
```

Generar una migracion nueva:

```bash
npm run migration:generate -- src/database/migrations/NombreDeLaMigracion
```

Ejecutar migraciones pendientes:

```bash
npm run migration:run
```

Revertir la ultima migracion:

```bash
npm run migration:revert
```

## Ejecutar la API

```bash
npm run start:dev
```

La API queda disponible en:

```text
http://localhost:3000/api
```

## Endpoints

### `POST /api/lost-pets`

Registra una mascota perdida.

Ejemplo de body:

```json
{
  "name": "Boxter",
  "species": "Perro",
  "breed": "Boxer",
  "color": "Cafe",
  "size": "Grande",
  "description": "Tiene una mancha blanca en el pecho y responde a su nombre.",
  "photoUrl": "https://amzns3-petradar.s3.us-east-1.amazonaws.com/pets/boxter.JPG",
  "ownerName": "Alex Taco",
  "ownerEmail": "alex@example.com",
  "ownerPhone": "5512345678",
  "address": "Condesa, Ciudad de Mexico",
  "lostDate": "2026-03-15T09:00:00.000Z",
  "lat": 19.4126,
  "lng": -99.1740
}
```

### `POST /api/found-pets`

Registra una mascota encontrada. Al guardar, busca automaticamente mascotas perdidas activas dentro de 500 metros y, si encuentra coincidencias, envia una notificacion por correo.

Ejemplo de body:

```json
{
  "species": "Perro",
  "breed": "Boxer",
  "color": "Cafe",
  "size": "Grande",
  "description": "Perro amistoso con collar azul, encontrado caminando cerca del parque.",
  "photoUrl": "https://amzns3-petradar.s3.us-east-1.amazonaws.com/pets/boxter.JPG",
  "finderName": "Juan Perez",
  "finderEmail": "juan@example.com",
  "finderPhone": "5511122233",
  "address": "Parque Mexico, Condesa, Ciudad de Mexico",
  "foundDate": "2026-03-15T09:30:00.000Z",
  "lat": 19.4129,
  "lng": -99.1738
}
```

## Busqueda por radio

La funcionalidad central usa PostGIS con:

- `ST_DWithin` para buscar coincidencias
- `ST_Distance` para ordenar por cercania
- cast a `::geography` para trabajar en metros

Consulta base utilizada:

```sql
SELECT
  id,
  name,
  species,
  breed,
  color,
  size,
  description,
  photo_url,
  owner_name,
  owner_email,
  owner_phone,
  address,
  lost_date,
  is_active,
  created_at,
  updated_at,
  ST_AsText(location) AS location,
  ST_Distance(
    location::geography,
    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
  ) AS distance
FROM lost_pets
WHERE is_active = true
  AND ST_DWithin(
    location::geography,
    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
    500
  )
ORDER BY distance ASC;
```

## Notificaciones por correo

Cuando una mascota encontrada coincide con una mascota perdida:

- se genera un correo HTML
- se envia al correo definido en `ALERT_EMAIL`
- el correo incluye:
  - datos de la mascota encontrada
  - datos de contacto de quien la encontro
  - mapa estatico de Mapbox con ambos puntos

Si faltan variables de correo, la API no se cae; solo registra un warning en logs y continua con la operacion.

## Validacion

La API usa:

- `class-validator`
- `class-transformer`
- `ValidationPipe` global

Esto valida los DTOs para:

- strings requeridos
- correos validos
- fechas en formato ISO
- coordenadas dentro de rango

## Scripts utiles

```bash
npm run build
npm run start:dev
npm run test
npm run test:e2e
npm run migration:generate -- src/database/migrations/NombreDeLaMigracion
npm run migration:run
npm run migration:revert
```

## Estado actual

Actualmente el proyecto ya cubre:

- registro de mascotas perdidas
- registro de mascotas encontradas
- busqueda automatica por radio de 500 metros
- notificacion por correo a correo generico
- soporte para mapa estatico de Mapbox

