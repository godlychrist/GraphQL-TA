# 🏎️ TicoAutos - GraphQL API Server

## 📌 Descripción del Proyecto
Servidor GraphQL de alto rendimiento para **TicoAutos**, diseñado para proporcionar un endpoint optimizado para la consulta y filtrado de vehículos. Su arquitectura permite que los clientes obtengan datos de forma flexible y selectiva, reduciendo la carga de red.

## ⚙️ Tecnologías Utilizadas
- **Framework:** Apollo Server (`@apollo/server`)
- **Entorno:** Node.js
- **Base de Datos:** Mongoose (MongoDB)
- **Autenticación:** JWT (para validar el token proveniente del Backend de Laravel)

## 🔄 Flujo de Trabajo y Arquitectura
Este servicio actúa como un intermediario directo a la base de datos de MongoDB, pero con toda la flexibilidad de GraphQL:

1.  **Definición de Esquemas (`schemas/typeDefs.js`)**: Especifica los tipos de la API (ej: `Vehicle`, `User`, `PaginatedVehicles`) y las consultas (`Queries`) permitidas. Incluye potentes filtros dinámicos (`VehicleFilters`) para búsqueda por marca, modelo, rango de años y rangos de precios combinados.
2.  **Resolvers (`resolvers/resolvers.js`)**: Encapsula la lógica para recuperar los datos de MongoDB de manera eficiente. Parsea los argumentos de GraphQL y genera dinámicamente la consulta de Mongoose (ej. convirtiendo rangos de strings en operadores `$gte`, `$lte` de Mongo). Implementa paginación directamente en la base de datos.
3.  **Contexto e Interceptor de Autenticación (`app.js`)**: 
    - Atrapa cada petición antes de llegar al resolver.
    - Extrae el token `Bearer` del encabezado de `Authorization`.
    - Utiliza `jsonwebtoken` para verificar la firma utilizando el **mismo secreto** (`JWT_SECRET`) que el backend de Laravel, integrándose perfectamente en el ecosistema.
    - Inyecta la identidad del usuario decodificada en el contexto de GraphQL, permitiendo a los resolvers adaptar sus respuestas.

## 🚀 Configuración e Instalación

### Requisitos previos
- Node.js v16+ y npm
- MongoDB local o remoto en ejecución.

### 1. Instalar dependencias
```bash
npm install
```

### 2. Variables de entorno
Asegúrate de configurar un archivo `.env` en la raíz del proyecto:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/TicoCars
JWT_SECRET=tu_secreto_de_laravel
```

### 3. Iniciar el servidor
```bash
npm start
```
El servidor de desarrollo de Apollo iniciará en `http://localhost:4000/`.
