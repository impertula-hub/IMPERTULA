// API centralizada para productos y proyectos
// Conecta con los endpoints reales de Impertula
// Con fallback a datos mock si las APIs no están disponibles

import { 
  productsData as mockProducts, 
  projectsData as mockProjects 
} from './mock-data';

const API_URLS = {
  products: 'https://product-api-ioy9.onrender.com/api/products',
  projects: 'https://apiproyects-qogl.onrender.com/api/proyectos',
  login: 'https://login-api-1e2w.onrender.com/api/auth/login',
  contact: 'https://contactapi-ihkj.onrender.com/api/contact'
};

// Flag para controlar si usar API real o mock
const USE_MOCK_DATA = false; // APIs reales activas

// Interfaces según la estructura de la API
export interface Product {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  description: string;
  image: string;
  brand: string;
  rating: number;
  fullDescription: string;
  features: string[];
  applications: string[];
  specifications: {
    presentation: string;
    coverage: string;
    dryingTime: string;
    colors: string;
    [key: string]: string;
  };
}

export interface ProjectImage {
  _id?: string;
  nombre?: string;
  tipo: 'url' | 'base64';
  // Para imágenes tipo URL
  url?: string;
  // Para imágenes tipo Base64
  mimeType?: string;
  data?: string;
  size?: number;
  esPrincipal?: boolean;
}

export interface Project {
  _id?: string;
  id?: string;
  // Campos obligatorios
  titulo: string;
  ubicacion: string;
  categoria: string;
  estado: string;
  cliente: string;
  duracion: string;
  area: string;
  equipo: string;
  descripcionCorta: string;
  // Campos opcionales
  fecha?: string;
  urlImagen?: string; // Campo legacy - mantener para retrocompatibilidad
  imagenes?: ProjectImage[]; // Nuevo campo flexible: soporta URLs Y Base64
  descripcionCompleta?: string;
  desafios?: string;
  soluciones?: string;
  resultados?: string;
  productosUtilizados?: string;
  // Virtuals del backend
  imagenPrincipal?: ProjectImage;
  todasLasImagenes?: ProjectImage[];
}

// Obtener token del localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('impertula_token');
};

// ==================== API DE PRODUCTOS ====================

export const productApi = {
  // GET /api/products - Listar todos los productos
  getAll: async (): Promise<Product[]> => {
    if (USE_MOCK_DATA) {
      return mockProducts;
    }
    try {
      console.log('🔄 Intentando cargar productos desde API:', API_URLS.products);
      const response = await fetch(API_URLS.products, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Products API response:', data);
      
      // Si la respuesta es un array, devolverlo directamente
      if (Array.isArray(data)) {
        return data;
      }
      
      // Si la respuesta es un objeto con una propiedad que contiene el array
      if (data && typeof data === 'object') {
        return data.data || data.products || [];
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error en productApi.getAll:', error);
      console.warn('⚠️ Usando datos mock como fallback');
      // Fallback a datos mock si la API falla
      return mockProducts;
    }
  },

  // GET /api/products/:id - Obtener producto por ID
  getById: async (id: string): Promise<Product> => {
    if (USE_MOCK_DATA) {
      const product = mockProducts.find(p => p._id === id);
      if (!product) throw new Error('Producto no encontrado');
      return product;
    }
    try {
      console.log('🔄 Cargando producto:', id);
      const response = await fetch(`${API_URLS.products}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
      });
      
      if (!response.ok) throw new Error('Error al obtener producto');
      const result = await response.json();
      console.log('✅ Product detail API response:', result);
      
      // La API devuelve { success: true, data: {...} }
      // Extraemos solo la propiedad data
      return result.data || result;
    } catch (error) {
      console.error('❌ Error en productApi.getById:', error);
      console.warn('⚠️ Usando datos mock como fallback');
      // Fallback a datos mock
      const product = mockProducts.find(p => p._id === id);
      if (!product) throw new Error('Producto no encontrado');
      return product;
    }
  },

  // POST /api/products - Crear producto (requiere token)
  create: async (product: Omit<Product, '_id' | 'id'>): Promise<Product> => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No hay token de autenticación');

      console.log('📤 Intentando crear producto:', product);

      const response = await fetch(API_URLS.products, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
      });

      console.log('📥 Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        // Verificar si la respuesta es JSON o HTML
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          console.error('❌ Error JSON del servidor:', error);
          throw new Error(error.message || error.error || 'Error al crear producto');
        } else {
          // Si no es JSON, probablemente es HTML (error del servidor)
          const errorText = await response.text();
          console.error('❌ Error response (non-JSON):', errorText.substring(0, 500));
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('✅ Producto creado exitosamente:', data);
      return data.data || data;
    } catch (error) {
      console.error('❌ Error en productApi.create:', error);
      throw error;
    }
  },

  // PUT /api/products/:id - Actualizar producto (requiere token)
  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No hay token de autenticación');

      const response = await fetch(`${API_URLS.products}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        // Verificar si la respuesta es JSON o HTML
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          throw new Error(error.message || 'Error al actualizar producto');
        } else {
          // Si no es JSON, probablemente es HTML (error del servidor)
          const errorText = await response.text();
          console.error('Error response (non-JSON):', errorText.substring(0, 200));
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en productApi.update:', error);
      throw error;
    }
  },

  // DELETE /api/products/:id - Eliminar producto (requiere token)
  delete: async (id: string): Promise<void> => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No hay token de autenticación');

      const response = await fetch(`${API_URLS.products}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Verificar si la respuesta es JSON o HTML
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          throw new Error(error.message || 'Error al eliminar producto');
        } else {
          // Si no es JSON, probablemente es HTML (error del servidor)
          const errorText = await response.text();
          console.error('Error response (non-JSON):', errorText.substring(0, 200));
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error en productApi.delete:', error);
      throw error;
    }
  }
};

// ==================== API DE PROYECTOS ====================

export const projectApi = {
  // GET /api/proyectos - Obtener todos los proyectos
  getAll: async (): Promise<Project[]> => {
    if (USE_MOCK_DATA) {
      return mockProjects;
    }
    try {
      console.log('🔄 Intentando cargar proyectos desde API:', API_URLS.projects);
      const response = await fetch(API_URLS.projects, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Projects API response:', data);
      
      // Si la respuesta es un array, devolverlo directamente
      if (Array.isArray(data)) {
        return data;
      }
      
      // Si la respuesta es un objeto con una propiedad que contiene el array
      if (data && typeof data === 'object') {
        return data.data || data.proyectos || data.projects || [];
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error en projectApi.getAll:', error);
      console.warn('⚠️ Usando datos mock como fallback');
      // Fallback a datos mock si la API falla
      return mockProjects;
    }
  },

  // GET /api/proyectos/:id - Obtener un proyecto por ID
  getById: async (id: string): Promise<Project> => {
    if (USE_MOCK_DATA) {
      const project = mockProjects.find(p => p._id === id);
      if (!project) throw new Error('Proyecto no encontrado');
      return project;
    }
    try {
      console.log('🔄 Cargando proyecto:', id);
      const response = await fetch(`${API_URLS.projects}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
      });
      
      if (!response.ok) throw new Error('Error al obtener proyecto');
      const result = await response.json();
      console.log('✅ Project detail API response:', result);
      
      // La API devuelve { success: true, data: {...} }
      // Extraemos solo la propiedad data
      return result.data || result;
    } catch (error) {
      console.error('❌ Error en projectApi.getById:', error);
      console.warn('⚠️ Usando datos mock como fallback');
      // Fallback a datos mock
      const project = mockProjects.find(p => p._id === id);
      if (!project) throw new Error('Proyecto no encontrado');
      return project;
    }
  },

  // POST /api/proyectos - Crear un nuevo proyecto (requiere token)
  create: async (project: Omit<Project, '_id' | 'id'>): Promise<Project> => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No hay token de autenticación');

      // Calcular tamaño aproximado del payload
      const payloadString = JSON.stringify(project);
      const payloadSizeMB = (payloadString.length / 1024 / 1024).toFixed(2);
      console.log(`Tamaño del payload: ${payloadSizeMB}MB`);
      
      // Advertir si el payload es muy grande
      if (parseFloat(payloadSizeMB) > 10) {
        console.warn('⚠️ El payload es muy grande. MongoDB tiene un límite de 16MB por documento.');
      }

      const response = await fetch(API_URLS.projects, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: payloadString
      });

      if (!response.ok) {
        // Verificar si la respuesta es JSON o HTML
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          console.error('Error del servidor:', error);
          throw new Error(error.message || error.error || 'Error al crear proyecto');
        } else {
          // Si no es JSON, probablemente es HTML (error del servidor)
          const errorText = await response.text();
          console.error('Error response (non-JSON):', errorText.substring(0, 500));
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('Proyecto creado exitosamente:', data);
      return data.data || data;
    } catch (error) {
      console.error('Error en projectApi.create:', error);
      throw error;
    }
  },

  // PUT /api/proyectos/:id - Actualizar un proyecto (requiere token)
  update: async (id: string, project: Partial<Project>): Promise<Project> => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No hay token de autenticación');

      const response = await fetch(`${API_URLS.projects}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(project)
      });

      if (!response.ok) {
        // Verificar si la respuesta es JSON o HTML
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          throw new Error(error.message || 'Error al actualizar proyecto');
        } else {
          // Si no es JSON, probablemente es HTML (error del servidor)
          const errorText = await response.text();
          console.error('Error response (non-JSON):', errorText.substring(0, 200));
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en projectApi.update:', error);
      throw error;
    }
  },

  // DELETE /api/proyectos/:id - Eliminar un proyecto (requiere token)
  delete: async (id: string): Promise<void> => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No hay token de autenticación');

      const response = await fetch(`${API_URLS.projects}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Verificar si la respuesta es JSON o HTML
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          throw new Error(error.message || 'Error al eliminar proyecto');
        } else {
          // Si no es JSON, probablemente es HTML (error del servidor)
          const errorText = await response.text();
          console.error('Error response (non-JSON):', errorText.substring(0, 200));
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error en projectApi.delete:', error);
      throw error;
    }
  },

  // GET /api/proyectos/estado/:estado - Filtrar proyectos por estado
  getByStatus: async (estado: string): Promise<Project[]> => {
    try {
      const response = await fetch(`${API_URLS.projects}/estado/${estado}`);
      if (!response.ok) throw new Error('Error al filtrar proyectos por estado');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en projectApi.getByStatus:', error);
      throw error;
    }
  },

  // GET /api/proyectos/categoria/:categoria - Filtrar proyectos por categoría
  getByCategory: async (categoria: string): Promise<Project[]> => {
    try {
      const response = await fetch(`${API_URLS.projects}/categoria/${categoria}`);
      if (!response.ok) throw new Error('Error al filtrar proyectos por categoría');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en projectApi.getByCategory:', error);
      throw error;
    }
  }
};