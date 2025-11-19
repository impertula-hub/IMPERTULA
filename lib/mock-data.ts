// Datos mock para desarrollo y pruebas
// Estos datos se usan cuando USE_MOCK_DATA = true en api.ts

import { Product, Project } from './api';

export const productsData: Product[] = [
  {
    _id: "1",
    id: "1",
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
    _id: "2",
    id: "2",
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
    _id: "3",
    id: "3",
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
    _id: "4",
    id: "4",
    name: "Henkel Acelerante de Fraguado",
    category: "Aditivo",
    description: "Acelerante para reducir tiempo de fraguado del concreto",
    image: "https://images.unsplash.com/photo-1657186593846-8d3e67155468?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWlsZGluZyUyMHdhdGVycHJvb2YlMjBtYXRlcmlhbHN8ZW58MXx8fHwxNzU4NjU0NzU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    brand: "Henkel",
    rating: 5,
    fullDescription: "El acelerante de fraguado Henkel es un aditivo químico de alto rendimiento que acelera significativamente el tiempo de fraguado del concreto, permitiendo mayor productividad en obras.",
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

export const projectsData: Project[] = [
  {
    _id: "1",
    id: "1",
    titulo: "Subestación Eléctrica CFE",
    ubicacion: "Estado de México",
    categoria: "Industrial",
    estado: "Completado",
    cliente: "Comisión Federal de Electricidad (CFE)",
    duracion: "3 meses",
    area: "2,500 m²",
    equipo: "12 especialistas",
    descripcionCorta: "Impermeabilización completa de azotea en instalaciones de la Comisión Federal de Electricidad con sistema de alta durabilidad.",
    fecha: "2024",
    urlImagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
    descripcionCompleta: "Proyecto de impermeabilización integral en instalaciones críticas de la CFE. Se implementó un sistema multicapa de alta resistencia diseñado para soportar condiciones extremas y garantizar protección a largo plazo de equipos eléctricos sensibles.",
    desafios: "Trabajo en instalaciones eléctricas activas, coordinación con protocolos de seguridad CFE, impermeabilización sin interrumpir operaciones, protección de equipamiento eléctrico sensible",
    soluciones: "Sistema de impermeabilización Fester Premium multicapa, trabajo por secciones sin afectar operación, protocolos de seguridad eléctrica estrictos, supervisión técnica continua",
    resultados: "100% de la superficie impermeabilizada sin incidentes, cero interrupciones en el servicio eléctrico, garantía extendida de 10 años, certificación de calidad CFE",
    productosUtilizados: "Fester Festerbond Premium, Sistema de refuerzo con malla, Sellador elastomérico"
  },
  {
    _id: "2",
    id: "2",
    titulo: "Complejo Industrial Zona Norte",
    ubicacion: "Monterrey, NL",
    categoria: "Industrial",
    estado: "En Proceso",
    cliente: "Grupo Industrial del Norte",
    duracion: "6 meses",
    area: "8,000 m²",
    equipo: "25 aplicadores certificados",
    descripcionCorta: "Aplicación de impermeabilización en proceso con equipo especializado y productos Fester de alta calidad.",
    fecha: "2024",
    urlImagen: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800",
    descripcionCompleta: "Proyecto de gran escala en complejo industrial manufacturero. Impermeabilización de naves industriales, oficinas administrativas y áreas de almacenamiento con sistemas especializados para cada zona según su uso y requerimientos.",
    desafios: "Múltiples tipos de superficie y pendientes, coordinación con operaciones de manufactura, condiciones climáticas variables de Monterrey, diferentes requisitos por área del complejo",
    soluciones: "Planificación por fases según prioridades operativas, sistemas diferenciados por zona (tráfico, químicos, etc.), monitoreo climático para optimizar aplicaciones, equipo especializado de aplicación en caliente",
    resultados: "60% del proyecto completado exitosamente, cero afectaciones a la producción, avance adelantado al cronograma original, alta satisfacción del cliente intermedia",
    productosUtilizados: "Sistema Fester Industrial, Impermeabilizante acrílico reflectivo, Aditivos Henkel para preparación"
  },
  {
    _id: "3",
    id: "3",
    titulo: "Desarrollo Habitacional Guadalajara",
    ubicacion: "Guadalajara, JAL",
    categoria: "Residencial",
    estado: "Completado",
    cliente: "Desarrollos Residenciales del Occidente",
    duracion: "4 meses",
    area: "6,500 m²",
    equipo: "20 aplicadores",
    descripcionCorta: "Impermeabilización integral en desarrollo residencial con productos Fester de alta resistencia.",
    fecha: "2023",
    urlImagen: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    descripcionCompleta: "Proyecto residencial de 120 viviendas con impermeabilización completa de azoteas, terrazas y áreas comunes. Implementación de sistema estético y funcional con garantía extendida para tranquilidad de los propietarios.",
    desafios: "120 viviendas con diferentes configuraciones, coordinación con múltiples frentes de trabajo, acabados estéticos uniformes requeridos, temporada de lluvias durante ejecución",
    soluciones: "Organización por bloques de viviendas, sistema Fester residencial con acabado uniforme, programación flexible según clima, supervisión de calidad casa por casa",
    resultados: "120 viviendas impermeabilizadas exitosamente, garantía de 7 años por escrito, cero quejas post-entrega, reconocimiento del desarrollador",
    productosUtilizados: "Fester Festerbond Residencial, Acriton Sellador, Acabado color personalizado"
  }
];
