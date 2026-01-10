# Impertula Website

Sitio web para Impertula - Soluciones en Impermeabilización

## 🚀 Estructura del Proyecto

```
/
├── components/
│   ├── admin/              # Componentes de administración
│   │   ├── AdminPanel.tsx  # Re-exporta desde raíz
│   │   ├── ProductManagement.tsx  # Gestión de productos con validación
│   │   └── ProjectManagement.tsx  # Re-exporta desde raíz
│   ├── auth/               # Componentes de autenticación
│   │   └── Login.tsx       # Modal de login
│   ├── details/            # Vistas de detalle
│   │   ├── ProductDetail.tsx
│   │   └── ProjectDetail.tsx
│   ├── layout/             # Componentes de layout
│   │   ├── Header.tsx      # Header con navegación
│   │   ├── Footer.tsx
│   │   └── FaviconHandler.tsx
│   ├── pages/              # Páginas independientes
│   │   ├── ProductsPage.tsx  # Marketplace de productos
│   │   └── ProjectsPage.tsx  # Galería de proyectos
│   ├── sections/           # Secciones del home
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ProductCarousel.tsx
│   │   ├── WorkSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── AssistanceSection.tsx
│   └── ui/                 # Componentes UI de shadcn
├── lib/
│   ├── api.ts              # API con fallback automático
│   ├── auth-context.tsx    # Contexto de autenticación
│   ├── data-store.ts       # Store de datos
│   └── mock-data.ts        # Datos mock de respaldo
└── App.tsx                 # App principal SIN React Router
```

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- Login mediante botón "Iniciar Sesión" en el header
- Modal de autenticación (no rutas)
- Rol por defecto: cliente
- Admin puede acceder al panel de administración

### 📦 Gestión de Productos (Admin)
- ✅ Vista de lista con tarjetas
- ✅ Formulario de creación/edición en PANTALLA COMPLETA
- ✅ Validación de campos obligatorios
- ✅ Alerta de "cambios sin guardar" al intentar salir
- ✅ Preview de imágenes
- ✅ Vista previa de cambios en tiempo real

### 🏗️ Gestión de Proyectos (Admin)
- ✅ Soporte para múltiples imágenes (URL y Base64)
- ✅ Campos obligatorios validados
- ✅ Formulario completo con especificaciones técnicas

### 🔄 Sistema de Navegación
- **SIN React Router** (navegación mediante estado)
- Logo IMPERTULA siempre lleva al home
- Navegación fluida entre vistas
- Scroll suave a secciones

### 🌐 Conexión API
- URLs reales configuradas:
  - Productos: `https://product-api-trzk.onrender.com/api/products`
  - Proyectos: `https://apiproyects-qogl.onrender.com/api/proyectos`
  - Login: `https://login-api-f245.onrender.com/api/auth/login`
  - Contacto: `https://contactapi-5qan.onrender.com/api/contact`
- Fallback automático a datos mock si falla CORS
- Headers CORS incluidos en todas las peticiones

## 🛠️ Tecnologías

- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS v4** para estilos
- **Motion** (framer-motion) para animaciones
- **Radix UI** para componentes accesibles
- **Lucide React** para iconos
- **Sonner** para notificaciones toast

## 📝 Scripts

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Construye para producción
npm run preview  # Preview de producción
```

## 🔑 Credenciales de Prueba

**Admin:**
- Email: `admin@impertula.com`
- Password: `admin123`

**Cliente:**
- Email: `cliente@impertula.com`
- Password: `cliente123`

## 🎨 Diseño

- Colores principales: Rojo (#EC1C24) y tonos corporativos
- Responsive: Mobile-first approach
- Animaciones suaves con Motion
- Componentes UI consistentes

## ⚠️ Notas Importantes

1. **No hay rutas con React Router** - La navegación es mediante estado interno
2. **Validación de cambios** - Al editar, si intentas salir sin guardar, se muestra alerta
3. **Pantalla completa en edición** - Los formularios ocupan toda la pantalla cuando editas/creas
4. **Las guías fueron eliminadas** - Proyecto más limpio

## 📂 Archivos Eliminados

- ❌ Todas las guías .md (DIAGNOSTICO, GUIA_RAPIDA, etc.)
- ❌ React Router y sus dependencias
- ❌ netlify.toml (no necesario sin routing)
- ❌ Login.tsx duplicado

## 🚧 Próximas Mejoras Sugeridas

- Agregar paginación en listas de productos/proyectos
- Implementar búsqueda avanzada con filtros
- Añadir drag & drop para reordenar imágenes
- Caché de datos para mejor rendimiento
- PWA para funcionalidad offline