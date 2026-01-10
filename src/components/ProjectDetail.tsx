import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, MapPin, Calendar, CheckCircle, Users, Ruler, Clock, Award, Image as ImageIcon, MessageCircle } from "lucide-react";
import { ImageZoom } from "./ImageZoom";
import { motion } from "motion/react";
import { projectApi, Project, ProjectImage } from "../lib/api";

// Función utilitaria para obtener la URL de imagen
const getImageUrl = (img: ProjectImage): string | null => {
  if (img.tipo === 'url' && img.url) {
    return img.url;
  } else if (img.tipo === 'base64' && img.data && img.mimeType) {
    return `data:${img.mimeType};base64,${img.data}`;
  }
  return null;
};

// Función utilitaria para obtener la URL de la imagen principal
const getPrincipalImageUrl = (project: Project): string | null => {
  // Prioridad 1: Buscar en imagenes array
  if (project.imagenes && project.imagenes.length > 0) {
    const principal = project.imagenes.find(img => img.esPrincipal) || project.imagenes[0];
    return getImageUrl(principal);
  }
  
  // Prioridad 2: URL legacy
  if (project.urlImagen) {
    return project.urlImagen;
  }
  
  return null;
};

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectDetail({ projectId, onBack }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const data = await projectApi.getById(projectId);
      setProject(data || null);
    } catch (error) {
      console.error("Error loading project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestQuote = () => {
    const whatsappNumber = "5217731335692";
    const message = encodeURIComponent(
      `Hola, me interesa solicitar una cotización para un proyecto similar a: ${project?.titulo || 'su proyecto'}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Proyecto no encontrado</h2>
          <Button onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  // Convertir strings a arrays para desafíos, soluciones, resultados y productos
  const challenges = project.desafios && typeof project.desafios === 'string' 
    ? project.desafios.split('\n').filter(item => item.trim()) 
    : [];
  const solutions = project.soluciones && typeof project.soluciones === 'string'
    ? project.soluciones.split('\n').filter(item => item.trim()) 
    : [];
  const results = project.resultados && typeof project.resultados === 'string'
    ? project.resultados.split('\n').filter(item => item.trim()) 
    : [];
  const products = project.productosUtilizados && typeof project.productosUtilizados === 'string'
    ? project.productosUtilizados.split('\n').filter(item => item.trim()) 
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="container mx-auto px-4">
        {/* Botón de retorno */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Button
            onClick={onBack}
            size="lg"
            variant="outline"
            className="gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver a Proyectos
          </Button>
        </motion.div>

        {/* Hero del proyecto */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            {getPrincipalImageUrl(project) ? (
              <div className="relative h-96">
                <ImageZoom
                  src={getPrincipalImageUrl(project)!}
                  alt={project.titulo || 'Proyecto'}
                  className="w-full h-96"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white pointer-events-none">
                  <div className="flex items-center gap-3 mb-4">
                    {project.estado && (
                      <Badge 
                        variant={project.estado === "Completado" ? "default" : "secondary"}
                        className="bg-white/90 text-primary hover:bg-white"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {project.estado}
                      </Badge>
                    )}
                    {project.categoria && (
                      <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                        {project.categoria}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold mb-4">{project.titulo || 'Proyecto'}</h1>
                  <div className="flex flex-wrap items-center gap-6 text-white/90">
                    {project.ubicacion && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{project.ubicacion}</span>
                      </div>
                    )}
                    {project.fecha && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{project.fecha}</span>
                      </div>
                    )}
                    {project.area && (
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4" />
                        <span>{project.area}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative h-96">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Información del proyecto */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Descripción del Proyecto</h2>
                {project.descripcionCompleta && (
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {project.descripcionCompleta}
                  </p>
                )}
                {project.descripcionCorta && (
                  <p className="text-muted-foreground leading-relaxed">
                    {project.descripcionCorta}
                  </p>
                )}
                {!project.descripcionCompleta && !project.descripcionCorta && (
                  <p className="text-muted-foreground">Sin descripción disponible</p>
                )}
              </CardContent>
            </Card>

            {challenges.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Desafíos del Proyecto</h3>
                  <ul className="space-y-3">
                    {challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="bg-orange-100 text-orange-600 rounded-full p-1 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-current" />
                        </div>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {solutions.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Soluciones Implementadas</h3>
                  <ul className="space-y-3">
                    {solutions.map((solution, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="bg-blue-100 text-blue-600 rounded-full p-1 mt-0.5">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {results.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    Resultados Obtenidos
                  </h3>
                  <ul className="space-y-3">
                    {results.map((result, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Sidebar con información adicional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Detalles del Proyecto</h3>
                <div className="space-y-4">
                  {project.cliente && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Cliente</p>
                        <p className="font-medium">{project.cliente}</p>
                      </div>
                    </div>
                  )}
                  {project.duracion && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duración</p>
                        <p className="font-medium">{project.duracion}</p>
                      </div>
                    </div>
                  )}
                  {project.area && (
                    <div className="flex items-start gap-3">
                      <Ruler className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Área de trabajo</p>
                        <p className="font-medium">{project.area}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {products.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Productos Utilizados</h3>
                  <ul className="space-y-2">
                    {products.map((product, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                        <span>{product}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Tienes un proyecto similar?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Podemos ayudarte a lograr resultados excepcionales como este.
                </p>
                <Button className="w-full" onClick={handleRequestQuote}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Solicitar Cotización
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}