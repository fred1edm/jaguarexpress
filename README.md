# 🐆 Jaguar Express - Ecosistema de Delivery

**Velocidad que Conecta** - Tu solución integral de delivery, encargos y transporte.

## 🌟 Descripción del Proyecto

Jaguar Express es un ecosistema completo de plataformas de delivery que incluye:

- 🛵 **Delivery de comida** - Entrega rápida de restaurantes locales
- 🛒 **Encargos personalizados** - Compra de medicinas, productos y regalos
- 🚚 **Transporte de carga** - Mudanzas y carga pesada especializada

## 🏗️ Arquitectura del Ecosistema

El proyecto está conformado por **4 componentes independientes** que trabajan en conjunto:

### 1. 🔧 Backend API REST
- **Framework**: Fastify + TypeScript
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: JWT + bcrypt
- **Documentación**: Swagger/OpenAPI

### 2. 🧑‍💻 App Cliente Web
- **Framework**: Next.js 14 + TypeScript
- **Estilos**: TailwindCSS
- **Estado**: Zustand
- **Consultas**: Axios

### 3. 📱 App Móvil WebView
- **Framework**: Flutter
- **WebView**: webview_flutter
- **URL**: https://v0-jaguar-express-design.vercel.app/

### 4. 🛠️ Panel Administrativo
- **Framework**: React + TypeScript
- **UI**: Shadcn/ui + Radix UI
- **Estado**: Zustand
- **Consultas**: TanStack React Query

## 📁 Estructura del Proyecto

```
jaguarexpress/
├── 📁 backend/              # Módulos del backend por dominio
│   ├── auth/               # Autenticación JWT
│   ├── negocios/           # Gestión de negocios
│   ├── productos/          # Gestión de productos
│   ├── pedidos/            # Gestión de pedidos
│   ├── repartidores/       # Gestión de repartidores
│   ├── configuracion/      # Configuración global
│   ├── middleware/         # Middlewares de Fastify
│   ├── types/              # Tipos TypeScript
│   └── utils/              # Utilidades
├── 📁 cliente-web/         # App cliente Next.js
├── 📁 panel-admin/         # Panel administrativo React
├── 📁 app-movil/           # App móvil Flutter
├── 📁 database/            # Scripts de base de datos
├── 📁 prisma/              # Esquemas y migraciones
├── 📁 api/                 # Servidor Fastify
└── 📁 src/                 # Frontend React base
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 20+ 
- PostgreSQL 15+
- pnpm (recomendado) o npm

### 1. Clonar e instalar dependencias
```bash
git clone <repository-url>
cd jaguarexpress
pnpm install
```

### 2. Configurar base de datos
```bash
# Crear base de datos PostgreSQL
createdb jaguarexpress

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
```

### 3. Configurar Prisma
```bash
# Generar cliente de Prisma
pnpm db:generate

# Aplicar esquema a la base de datos
pnpm db:push

# Opcional: Poblar con datos de ejemplo
pnpm db:seed
```

## 🎯 Scripts Disponibles

### Desarrollo
```bash
# Ejecutar todo el ecosistema
pnpm ecosystem:dev

# Solo cliente web
pnpm client:dev

# Solo backend API
pnpm backend:dev

# Configuración inicial completa
pnpm setup
```

### Base de datos
```bash
# Generar cliente Prisma
pnpm db:generate

# Aplicar cambios al esquema
pnpm db:push

# Crear migración
pnpm db:migrate

# Abrir Prisma Studio
pnpm db:studio

# Poblar base de datos
pnpm db:seed
```

### Producción
```bash
# Construir proyecto
pnpm build

# Verificar tipos
pnpm check

# Linting
pnpm lint
```

## 🔄 Flujo de un Pedido

1. **Cliente** se registra e inicia sesión
2. **Cliente** explora negocios y selecciona productos
3. **Cliente** finaliza pedido → estado `PENDIENTE`
4. **Sistema** notifica a repartidores disponibles
5. **Repartidor** acepta pedido → estado `CONFIRMADO`
6. **Repartidor** compra productos → estado `EN_PREPARACION`
7. **Repartidor** sale a entregar → estado `EN_CAMINO`
8. **Repartidor** entrega y cobra → estado `ENTREGADO`

## 🔐 Autenticación

- **Sin Firebase**: Autenticación completamente controlada por nuestro backend
- **JWT Tokens**: Generados y validados por Fastify
- **Roles**: Cliente, Repartidor, Administrador
- **Protección**: Middleware de validación en todas las rutas protegidas

## 📊 Módulos del Sistema

### Autenticación
- `POST /api/auth/register` - Registro de cliente
- `POST /api/auth/login` - Login y generación JWT
- `GET /api/auth/me` - Datos del usuario autenticado

### Negocios
- CRUD completo de negocios
- Tipos: restaurante, tienda, farmacia, otros
- Horarios, zonas, promociones, tarifas

### Productos
- Relacionados con negocios
- Categorías, ingredientes, alérgenos
- Control de disponibilidad

### Pedidos
- Flujo completo de estados
- Asignación automática de repartidores
- Pago contra entrega

### Repartidores
- Registro opcional
- Estados: disponible, ocupado, inactivo
- Asignación: primer disponible que acepta

## 🎨 Diseño y UI

### Colores del Sistema
- **Jaguar Dorado**: `#FFD700` (botones principales)
- **Jaguar Negro**: `#1A1A1A` (texto principal)
- **Jaguar Gris**: `#F5F5F5` (fondos)

### Componentes
- Diseño mobile-first
- Componentes reutilizables con Shadcn/ui
- Iconografía con Lucide React
- Responsivo en todos los breakpoints

## 🌐 URLs del Ecosistema

- **Cliente Web**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Panel Admin**: http://localhost:5173
- **App Móvil**: https://v0-jaguar-express-design.vercel.app/
- **Prisma Studio**: http://localhost:5555

## 📝 Documentación Adicional

- [📋 Documento de Requerimientos (PRD)](.trae/documents/jaguar-express-prd.md)
- [🏗️ Arquitectura Técnica](.trae/documents/jaguar-express-arquitectura-tecnica.md)
- [🔗 API Documentation](http://localhost:3001/docs) (cuando el servidor esté ejecutándose)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**Jaguar Express** - Velocidad que Conecta 🐆⚡
