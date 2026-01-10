// Almacén de datos centralizado para productos y proyectos
// Preparado para ser reemplazado con llamadas API

export interface Product {
  id: number;
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

export interface Project {
  id: number;
  title: string;
  location: string;
  date: string;
  description: string;
  image: string;
  category: string;
  status: string;
  fullDescription: string;
  client: string;
  duration: string;
  area: string;
  team: string;
  challenges: string[];
  solutions: string[];
  results: string[];
  products: string[];
}

// Datos iniciales - en producción vendrían de la API
let productsData: Product[] = [
  {
    id: 1,
    name: "Fester Festerbond",
    category: "Impermeabilizante",
    description: "Impermeabilizante acrílico de alta adherencia para azoteas y muros",
    image: "https://www.impermundo.mx/wp-content/uploads/2013/06/Impermeabilizante-Fester-Festerbond.jpg",
    brand: "Fester",
    rating: 5,
    fullDescription: "Festerbond es un impermeabilizante acrílico de alta calidad diseñado para proteger azoteas, muros y superficies expuestas a la intemperie. Su fórmula avanzada proporciona una excelente adherencia y durabilidad.",
    features: [
      "Alta resistencia a los rayos UV",
      "Excelente elasticidad y flexibilidad",
      "Fácil aplicación con brocha, rodillo o aspersión",
      "Resistente al intemperismo",
      "Bajo mantenimiento",
      "Secado rápido"
    ],
    applications: [
      "Azoteas de concreto",
      "Muros exteriores",
      "Superficies horizontales y verticales",
      "Reparaciones y mantenimiento"
    ],
    specifications: {
      presentation: "Cubetas de 19L y 4L",
      coverage: "2-3 m² por litro",
      dryingTime: "2-4 horas al tacto",
      colors: "Blanco, Terracota, Gris"
    }
  },
  {
    id: 2,
    name: "Fester Acriton Sellador 4L",
    category: "Sellador",
    description: "Sellador acrílico elastomérico para juntas y fisuras",
    image: "https://cdn11.bigcommerce.com/s-qsnqc7y8a6/images/stencil/960w/products/124/424/FESTER_ACRITON_SELLADOR_4L__19920.1715903519.png",
    brand: "Fester",
    rating: 5,
    fullDescription: "Acriton Sellador es un producto elastomérico de alto rendimiento diseñado para sellar juntas, grietas y fisuras en todo tipo de superficies. Su excelente adherencia y flexibilidad lo hace ideal para zonas con movimiento.",
    features: [
      "Alta elasticidad y flexibilidad",
      "Excelente adherencia sobre múltiples sustratos",
      "Resistente al agua y a la intemperie",
      "No se agrieta ni se desprende",
      "Aplicación fácil y rápida",
      "Pintable después del curado"
    ],
    applications: [
      "Sellado de juntas de construcción",
      "Reparación de grietas en muros y losas",
      "Sellado de perímetro de ventanas y puertas",
      "Uniones entre diferentes materiales"
    ],
    specifications: {
      presentation: "Cubetas de 4L",
      coverage: "Depende del ancho de junta",
      dryingTime: "24 horas curado completo",
      colors: "Blanco, Gris"
    }
  },
  {
    id: 3,
    name: "Impermeabilizante Acrílico Premium",
    category: "Impermeabilizante",
    description: "Recubrimiento impermeabilizante de alta calidad para exteriores",
    image: "https://cdn.homedepot.com.mx/productos/222979/222979-d.jpg",
    brand: "Fester",
    rating: 4,
    fullDescription: "Nuestro impermeabilizante acrílico premium ofrece la máxima protección para superficies exteriores. Formulado con resinas acrílicas de alta calidad que garantizan durabilidad y resistencia extrema.",
    features: [
      "Protección superior contra agua y humedad",
      "Alta resistencia a condiciones climáticas extremas",
      "Refleja rayos solares reduciendo temperatura",
      "Fórmula de larga duración",
      "Acabado estético y uniforme",
      "Ecológico y bajo en compuestos volátiles"
    ],
    applications: [
      "Azoteas residenciales y comerciales",
      "Terrazas y balcones",
      "Muros de contención",
      "Superficies de concreto expuestas"
    ],
    specifications: {
      presentation: "Cubetas de 19L",
      coverage: "2.5-3.5 m² por litro",
      dryingTime: "3-5 horas",
      colors: "Múltiples colores disponibles"
    }
  },
  {
    id: 4,
    name: "Heckel Acelerante de Fraguado",
    category: "Aditivo",
    description: "Acelerante para reducir tiempo de fraguado del concreto",
    image: "https://images.unsplash.com/photo-1657186593846-8d3e67155468?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWlsZGluZyUyMHdhdGVycHJvb2YlMjBtYXRlcmlhbHN8ZW58MXx8fHwxNzU4NjU0NzU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    brand: "Heckel",
    rating: 5,
    fullDescription: "El acelerante de fraguado Heckel es un aditivo químico de alto rendimiento que acelera significativamente el tiempo de fraguado del concreto, permitiendo mayor productividad en obras.",
    features: [
      "Reduce el tiempo de fraguado hasta en 50%",
      "No afecta la resistencia final del concreto",
      "Permite trabajar a bajas temperaturas",
      "Ideal para reparaciones urgentes",
      "Compatible con cementos Portland",
      "Dosificación precisa y controlada"
    ],
    applications: [
      "Reparaciones de emergencia",
      "Trabajos en clima frío",
      "Proyectos con tiempos ajustados",
      "Prefabricados de concreto"
    ],
    specifications: {
      presentation: "Garrafas de 5L y 20L",
      dosage: "0.5-2% del peso del cemento",
      reduction: "Hasta 50% del tiempo de fraguado",
      compatibility: "Todo tipo de cemento Portland"
    }
  }
];

let projectsData: Project[] = [];

// API Mock - Simula llamadas HTTP
// TODO: Reemplazar con llamadas reales a la API

export const productApi = {
  // GET /api/products
  getAll: async (): Promise<Product[]> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...productsData];
  },

  // GET /api/products/:id
  getById: async (id: number): Promise<Product | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return productsData.find(p => p.id === id);
  },

  // POST /api/products
  create: async (product: Omit<Product, "id">): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newId = Math.max(...productsData.map(p => p.id), 0) + 1;
    const newProduct = { ...product, id: newId };
    productsData.push(newProduct);
    return newProduct;
  },

  // PUT /api/products/:id
  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = productsData.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Producto no encontrado");
    productsData[index] = { ...productsData[index], ...product };
    return productsData[index];
  },

  // DELETE /api/products/:id
  delete: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    productsData = productsData.filter(p => p.id !== id);
  }
};

export const projectApi = {
  // GET /api/projects
  getAll: async (): Promise<Project[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...projectsData];
  },

  // GET /api/projects/:id
  getById: async (id: number): Promise<Project | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return projectsData.find(p => p.id === id);
  },

  // POST /api/projects
  create: async (project: Omit<Project, "id">): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newId = Math.max(...projectsData.map(p => p.id), 0) + 1;
    const newProject = { ...project, id: newId };
    projectsData.push(newProject);
    return newProject;
  },

  // PUT /api/projects/:id
  update: async (id: number, project: Partial<Project>): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = projectsData.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Proyecto no encontrado");
    projectsData[index] = { ...projectsData[index], ...project };
    return projectsData[index];
  },

  // DELETE /api/projects/:id
  delete: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    projectsData = projectsData.filter(p => p.id !== id);
  }
};

// Inicializar proyectos con las imágenes importadas
export function initializeProjects(images: {
  workImage1: string;
  workImage2: string;
  workImage3: string;
  cfeRoofImage: string;
  industrialWorkImage: string;
  clientLogos1: string;
  clientLogos2: string;
  clientLogos3: string;
}) {
  projectsData = [
    {
      id: 1,
      title: "Subestación Eléctrica CFE",
      location: "Estado de México",
      date: "2024",
      description: "Impermeabilización completa de azotea en instalaciones de la Comisión Federal de Electricidad con sistema de alta durabilidad.",
      image: images.cfeRoofImage,
      category: "Industrial",
      status: "Completado",
      fullDescription: "Proyecto de impermeabilización integral en instalaciones críticas de la CFE. Se implementó un sistema multicapa de alta resistencia diseñado para soportar condiciones extremas y garantizar protección a largo plazo de equipos eléctricos sensibles.",
      client: "Comisión Federal de Electricidad (CFE)",
      duration: "3 meses",
      area: "2,500 m²",
      team: "12 especialistas",
      challenges: [
        "Trabajo en instalaciones eléctricas activas",
        "Coordinación con protocolos de seguridad CFE",
        "Impermeabilización sin interrumpir operaciones",
        "Protección de equipamiento eléctrico sensible"
      ],
      solutions: [
        "Sistema de impermeabilización Fester Premium multicapa",
        "Trabajo por secciones sin afectar operación",
        "Protocolos de seguridad eléctrica estrictos",
        "Supervisión técnica continua"
      ],
      results: [
        "100% de la superficie impermeabilizada sin incidentes",
        "Cero interrupciones en el servicio eléctrico",
        "Garantía extendida de 10 años",
        "Certificación de calidad CFE"
      ],
      products: ["Fester Festerbond Premium", "Sistema de refuerzo con malla", "Sellador elastomérico"]
    },
    {
      id: 2,
      title: "Complejo Industrial Zona Norte",
      location: "Monterrey, NL",
      date: "2024",
      description: "Aplicación de impermeabilización en proceso con equipo especializado y productos Fester de alta calidad.",
      image: images.industrialWorkImage,
      category: "Industrial",
      status: "En Proceso",
      fullDescription: "Proyecto de gran escala en complejo industrial manufacturero. Impermeabilización de naves industriales, oficinas administrativas y áreas de almacenamiento con sistemas especializados para cada zona según su uso y requerimientos.",
      client: "Grupo Industrial del Norte",
      duration: "6 meses (en curso)",
      area: "8,000 m²",
      team: "25 aplicadores certificados",
      challenges: [
        "Múltiples tipos de superficie y pendientes",
        "Coordinación con operaciones de manufactura",
        "Condiciones climáticas variables de Monterrey",
        "Diferentes requisitos por área del complejo"
      ],
      solutions: [
        "Planificación por fases según prioridades operativas",
        "Sistemas diferenciados por zona (tráfico, químicos, etc.)",
        "Monitoreo climático para optimizar aplicaciones",
        "Equipo especializado de aplicación en caliente"
      ],
      results: [
        "60% del proyecto completado exitosamente",
        "Cero afectaciones a la producción",
        "Avance adelantado al cronograma original",
        "Alta satisfacción del cliente intermedia"
      ],
      products: ["Sistema Fester Industrial", "Impermeabilizante acrílico reflectivo", "Aditivos Heckel para preparación"]
    },
    {
      id: 3,
      title: "Planta Industrial Premium",
      location: "Estado de México",
      date: "2024",
      description: "Proyecto de impermeabilización en nave industrial con sistema completo de protección.",
      image: images.workImage1,
      category: "Industrial",
      status: "Completado",
      fullDescription: "Impermeabilización completa de nave industrial de almacenamiento con requisitos especiales de protección contra humedad para productos sensibles. Sistema de alta eficiencia energética con propiedades reflectivas.",
      client: "Logística Industrial SA de CV",
      duration: "2 meses",
      area: "3,200 m²",
      team: "15 especialistas",
      challenges: [
        "Requisitos estrictos de control de humedad",
        "Necesidad de eficiencia energética",
        "Plazo ajustado de ejecución",
        "Pendientes complejas y desagües múltiples"
      ],
      solutions: [
        "Sistema Fester reflectivo de alta eficiencia",
        "Refuerzo especial en zonas de desagüe",
        "Turnos extendidos para cumplir plazos",
        "Control de calidad continuo en cada fase"
      ],
      results: [
        "Reducción del 30% en temperatura interior",
        "Proyecto entregado antes del plazo",
        "Certificación de impermeabilización total",
        "Cliente implementó el sistema en otras sucursales"
      ],
      products: ["Fester Reflectivo Premium", "Sistema de traslape reforzado", "Selladores especiales"]
    },
    {
      id: 4,
      title: "Desarrollo Habitacional",
      location: "Guadalajara, JAL",
      date: "2023",
      description: "Impermeabilización integral en desarrollo residencial con productos Fester de alta resistencia.",
      image: images.workImage2,
      category: "Residencial",
      status: "Completado",
      fullDescription: "Proyecto residencial de 120 viviendas con impermeabilización completa de azoteas, terrazas y áreas comunes. Implementación de sistema estético y funcional con garantía extendida para tranquilidad de los propietarios.",
      client: "Desarrollos Residenciales del Occidente",
      duration: "4 meses",
      area: "6,500 m²",
      team: "20 aplicadores",
      challenges: [
        "120 viviendas con diferentes configuraciones",
        "Coordinación con múltiples frentes de trabajo",
        "Acabados estéticos uniformes requeridos",
        "Temporada de lluvias durante ejecución"
      ],
      solutions: [
        "Organización por bloques de viviendas",
        "Sistema Fester residencial con acabado uniforme",
        "Programación flexible según clima",
        "Supervisión de calidad casa por casa"
      ],
      results: [
        "120 viviendas impermeabilizadas exitosamente",
        "Garantía de 7 años por escrito",
        "Cero quejas post-entrega",
        "Reconocimiento del desarrollador"
      ],
      products: ["Fester Festerbond Residencial", "Acriton Sellador", "Acabado color personalizado"]
    },
    {
      id: 5,
      title: "Proyecto Residencial Premium",
      location: "Guadalajara, JAL",
      date: "2023",
      description: "Aplicación de impermeabilización en desarrollo habitacional con productos Fester de alta calidad.",
      image: images.workImage3,
      category: "Residencial",
      status: "Completado",
      fullDescription: "Desarrollo residencial de lujo con amenidades premium. Impermeabilización de áreas habitacionales, albercas, fuentes decorativas, estacionamientos en azotea y jardines en altura con sistemas especializados para cada aplicación.",
      client: "Premium Living Guadalajara",
      duration: "5 meses",
      area: "4,800 m²",
      team: "18 especialistas",
      challenges: [
        "Múltiples tipos de impermeabilización requeridos",
        "Acabados de lujo y estética premium",
        "Impermeabilización de albercas y fuentes",
        "Jardines en altura con sistemas especiales"
      ],
      solutions: [
        "Sistemas diferenciados por aplicación específica",
        "Impermeabilizante especial para albercas",
        "Acabados premium en colores personalizados",
        "Sistema de drenaje integrado en jardines"
      ],
      results: [
        "Desarrollo de lujo completamente protegido",
        "Sistema de albercas sin filtraciones",
        "Jardines en altura funcionando perfectamente",
        "Proyecto referencia para futuros desarrollos"
      ],
      products: ["Sistema Fester Premium Residencial", "Impermeabilizante para albercas", "Selladores especiales decorativos"]
    }
  ];
}
