# 🐆 Jaguar Express - Ecosistema de Delivery

**Velocidad que Conecta** - Tu solución integral de delivery, encargos y transporte.

## 🌟 Descripción del Proyecto

Jaguar Express es un ecosistema completo de plataformas de delivery que incluye:

- 🛵 **Delivery de comida** - Entrega rápida de restaurantes locales
- 🛒 **Encargos personalizados** - Compra de medicinas, productos y regalos
- 🚚 **Transporte de carga** - Mudanzas y carga pesada especializada

## 🏗️ Arquitectura del Ecosistema

El monorepo se organiza en **4 módulos principales**:

1. 🔧 **jaguar-express-backend** – API REST con Fastify + TypeScript *(pendiente)*  
2. 🧑‍💻 **jaguar-express** – Aplicación web en Next.js 14 + TailwindCSS *(implementado)*  
3. 📱 **jaguar-express-webview** – Contenedor móvil Flutter que carga la app web en un WebView *(placeholder)*  
4. 🛠️ **jaguar-express-admin** – Panel administrativo en React + Vite *(pendiente)*

## 📁 Estructura del Proyecto

```
jaguarexpress/
├── jaguar-express/          # App web Next.js (implementado)
├── jaguar-express-webview/  # Contenedor Flutter WebView (placeholder)
├── jaguar-express-admin/    # Panel administrativo React (pendiente)
├── jaguar-express-backend/  # API REST Fastify (pendiente)
├── node_modules/            # Dependencias del monorepo
├── package.json
└── pnpm-workspace.yaml
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 20+
- pnpm (recomendado)

### Clonar e instalar dependencias
```bash
git clone <repository-url>
cd jaguarexpress
pnpm install
```

### Ejecutar la app web
```bash
pnpm client:dev
```
La aplicación web estará disponible en [http://localhost:3000](http://localhost:3000).

La aplicación móvil se implementará como un contenedor Flutter que muestra esta app en un WebView, por lo que no requiere configuración adicional mientras la app web esté en ejecución.

## 🎯 Scripts Disponibles

### Desarrollo
```bash
# Ejecutar la app web
pnpm client:dev

# Panel administrativo (pendiente)
pnpm admin:dev

# Backend API (pendiente)
pnpm backend:dev
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
- **Backend API (Railway)**: https://web-production-927f.up.railway.app
- **Panel Admin**: http://localhost:5173
- **App Móvil**: https://v0-jaguar-express-design.vercel.app/
- **Prisma Studio**: http://localhost:5555

> Para desarrollo local puedes usar `http://localhost:3001` o configurar la variable de entorno `NEXT_PUBLIC_API_URL` con la URL que necesites.

## 📝 Documentación Adicional

- [📋 Documento de Requerimientos (PRD)](.trae/documents/jaguar-express-prd.md)
- [🏗️ Arquitectura Técnica](.trae/documents/jaguar-express-arquitectura-tecnica.md)
- [🔗 API Documentation](https://web-production-927f.up.railway.app/docs) (servidor en Railway)
- [🔗 API Documentation (local)](http://localhost:3001/docs)

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
