# PetRadar 🐾

PetRadar es una API REST construida con NestJS para registrar mascotas perdidas y mascotas encontradas.  
Cuando se registra una mascota encontrada, el sistema busca automaticamente mascotas perdidas activas dentro de un radio de **500 metros** usando **PostGIS** y dispara una **notificacion por correo** con informacion del hallazgo y un **mapa estatico de Mapbox**. 📍

## ✨ Funcionalidades

- Registrar mascotas perdidas con `POST /api/lost-pets`
- Registrar mascotas encontradas con `POST /api/found-pets`
- Buscar coincidencias por proximidad usando `ST_DWithin`
- Calcular distancia real en metros con `::geography`
- Enviar correos HTML con template personalizado
- Mostrar foto de la mascota en los correos
- Incluir mapa estatico con el punto perdido y el punto encontrado

## 🛠️ Stack

- **NestJS**
- **TypeORM**
- **PostgreSQL + PostGIS**
- **Nodemailer**
- **Mapbox Static Images API**
- **class-validator / class-transformer**

## 📁 Estructura del proyecto

- `src/lost-pets/`: modulo de mascotas perdidas
- `src/found-pets/`: modulo de mascotas encontradas
- `src/notifications/`: servicio de notificaciones, tipos y templates de correo
- `src/database/`: data source y migraciones
- `src/config/`: variables de entorno

## 📋 Requisitos

- Node.js 20 o superior
- npm
- Docker y Docker Compose

## 🚀 Instalacion

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/pet-radar.git
cd pet-radar
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raiz del proyecto:

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

| Variable         | Descripcion                                                               |
|------------------|---------------------------------------------------------------------------|
| `MAILER_EMAIL`   | Correo desde el que se enviaran las notificaciones                        |
| `MAILER_PASSWORD`| Password o app password del proveedor de correo                          |
| `MAILER_SERVICE` | Proveedor configurado en Nodemailer, por ejemplo `gmail`                 |
| `MAPBOX_TOKEN`   | Token para generar el mapa estatico de Mapbox                            |
| `ALERT_EMAIL`    | Correo que recibira la alerta cuando no exista coincidencia cercana       |

### 4. Levantar la base de datos

```bash
docker compose up -d
```

Esto inicia un contenedor de PostgreSQL con PostGIS con la siguiente configuracion por defecto:

| Parametro     | Valor       |
|---------------|-------------|
| Host          | `localhost` |
| Puerto        | `5432`      |
| Base de datos | `petradar`  |
| Usuario       | `postgres`  |
| Password      | `postgres`  |

### 5. Ejecutar migraciones

```bash
npm run migration:run
```

### 6. Iniciar la API

```bash
npm run start:dev
```

La API estara disponible en:

```text
http://localhost:3000/api
```

---

## 🧱 Comandos de migraciones

| Comando                                                                          | Descripcion                         |
|----------------------------------------------------------------------------------|-------------------------------------|
| `npm run migration:run`                                                           | Ejecuta las migraciones pendientes  |
| `npm run migration:generate -- src/database/migrations/NombreDeLaMigracion`      | Genera una nueva migracion          |
| `npm run migration:revert`                                                        | Revierte la ultima migracion        |

## 🔌 Endpoints

### `POST /api/lost-pets`

Registra una mascota perdida.

#### Ejemplo de body

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

Registra una mascota encontrada. Al guardar, busca automaticamente mascotas perdidas activas dentro de 500 metros.

#### Ejemplo de body

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

## 📍 Busqueda por radio

La funcionalidad central usa PostGIS con:

- `ST_DWithin` para encontrar mascotas perdidas activas dentro del radio
- `ST_Distance` para ordenar por cercania
- cast a `::geography` para medir en metros

### Query base

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

## 📧 Notificaciones por correo

PetRadar maneja dos escenarios:

### 1. Cuando hay coincidencias cercanas 🐶

- se envia correo al `owner_email` de cada mascota perdida encontrada
- el correo incluye:
  - datos de la mascota encontrada
  - datos de contacto de quien la encontro
  - foto de la mascota encontrada
  - mapa estatico con el punto perdido y el punto encontrado

### 2. Cuando no hay coincidencias cercanas 📨

- se envia una alerta generica al `ALERT_EMAIL`
- el correo incluye:
  - datos de la mascota encontrada
  - datos de contacto de quien la encontro
  - foto de la mascota encontrada

Si faltan variables de correo, la API no se cae; solo registra un warning en logs y continua con la operacion.

## ✅ Validacion

La API usa validacion global con `ValidationPipe`, `class-validator` y `class-transformer`.

Se valida:

- strings requeridos
- correos validos
- fechas en formato ISO
- coordenadas dentro de rango
- URLs opcionales para imagenes

## 🧪 Scripts utiles

```bash
npm run build
npm run start:dev
npm run test
npm run test:e2e
npm run migration:generate -- src/database/migrations/NombreDeLaMigracion
npm run migration:run
npm run migration:revert
```

## 🚀 Estado actual

Actualmente el proyecto ya cubre:

- registro de mascotas perdidas
- registro de mascotas encontradas
- busqueda automatica por radio de 500 metros
- notificacion por correo al duenio cuando hay coincidencia
- alerta generica cuando no existe coincidencia cercana
- templates HTML para correos
- soporte para imagenes de mascotas en correo
- mapa estatico de Mapbox

## 💡 Flujo general

1. Se registra una mascota perdida
2. Se registra una mascota encontrada
3. El sistema busca mascotas perdidas activas dentro de 500 metros
4. Si encuentra coincidencias, notifica al duenio
5. Si no encuentra coincidencias, manda alerta generica al correo configurado

---

Hecho con NestJS + PostGIS + Nodemailer para el proyecto **PetRadar** 🐾
