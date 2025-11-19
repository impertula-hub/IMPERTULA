import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { AspectRatio } from "./ui/aspect-ratio";
import { 
  Search, 
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  SlidersHorizontal,
  ChevronDown,
  Wrench
} from "lucide-react";
import { motion } from "motion/react";
import { projectApi, Project, ProjectImage } from "../lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Función utilitaria para obtener la URL de la imagen principal
const getPrincipalImageUrl = (project: Project): string | null => {
  // Prioridad 1: Buscar en imagenes array
  if (project.imagenes && project.imagenes.length > 0) {
    const principal = project.imagenes.find(img => img.esPrincipal) || project.imagenes[0];
    
    if (principal.tipo === 'url' && principal.url) {
      return principal.url;
    } else if (principal.tipo === 'base64' && principal.data && principal.mimeType) {
      return `data:${principal.mimeType};base64,${principal.data}`;
    }
  }
  
  // Prioridad 2: URL legacy
  if (project.urlImagen) {
    return project.urlImagen;
  }
  
  return null;
};

interface ProjectsPageProps {
  onBack: () => void;
  onProjectClick: (projectId: string) => void;
}

export function ProjectsPage({ onBack, onProjectClick }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [filtersOpen, setFiltersOpen] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectApi.getAll();
      if (Array.isArray(data)) {
        setProjects(data);
      } else if (data && typeof data === 'object') {
        const projectsArray = (data as any).data || (data as any).proyectos || (data as any).projects || [];
        setProjects(Array.isArray(projectsArray) ? projectsArray : []);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProjects = () => {
    let filtered = [...projects];

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(project => project.categoria === selectedCategory);
    }

    // Filtro de estado - ARREGLADO
    if (selectedStatus !== "all") {
      filtered = filtered.filter(project => {
        // Normalizar el estado para comparación
        const normalizedProjectState = project.estado?.toLowerCase().trim() || "";
        const normalizedFilterState = selectedStatus.toLowerCase().trim();
        return normalizedProjectState === normalizedFilterState;
      });
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.fechaFinalizacion || b.fechaInicio || 0).getTime() - 
                 new Date(a.fechaFinalizacion || a.fechaInicio || 0).getTime();
        case "oldest":
          return new Date(a.fechaFinalizacion || a.fechaInicio || 0).getTime() - 
                 new Date(b.fechaFinalizacion || b.fechaInicio || 0).getTime();
        case "name":
          return a.titulo.localeCompare(b.titulo);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  };

  const categories = ["all", ...Array.from(new Set(projects.map(p => p.categoria)))];
  const statuses = ["all", ...Array.from(new Set(projects.map(p => p.estado)))];

  const completedProjects = filteredProjects.filter(p => 
    p.estado?.toLowerCase().trim() === "completado"
  );
  const inProgressProjects = filteredProjects.filter(p => 
    p.estado?.toLowerCase().trim() === "en progreso" || 
    p.estado?.toLowerCase().trim() === "en proceso"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con breadcrumb */}
      <div className="bg-white border-b sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="cursor-pointer hover:text-primary" onClick={onBack}>Inicio</span>
              <span>/</span>
              <span>Proyectos</span>
            </div>
          </div>

          {/* Barra de búsqueda y controles */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Más recientes</SelectItem>
                <SelectItem value="oldest">Más antiguos</SelectItem>
                <SelectItem value="name">Nombre A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar de filtros */}
          <aside className="lg:w-64 shrink-0">
            <Card className="sticky top-32">
              <CardContent className="p-4">
                <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full mb-4">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      <h3 className="font-semibold">Filtros</h3>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-6">
                    {/* Filtro por categoría */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm">Categoría</h4>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <label
                            key={category}
                            className="flex items-center gap-2 cursor-pointer hover:text-primary"
                          >
                            <input
                              type="radio"
                              name="category"
                              value={category}
                              checked={selectedCategory === category}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="cursor-pointer"
                            />
                            <span className="text-sm capitalize">
                              {category === "all" ? "Todas" : category}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              ({category === "all" 
                                ? projects.length 
                                : projects.filter(p => p.categoria === category).length})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Filtro por estado */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm">Estado</h4>
                      <div className="space-y-2">
                        {statuses.map((status) => (
                          <label
                            key={status}
                            className="flex items-center gap-2 cursor-pointer hover:text-primary"
                          >
                            <input
                              type="radio"
                              name="status"
                              value={status}
                              checked={selectedStatus === status}
                              onChange={(e) => setSelectedStatus(e.target.value)}
                              className="cursor-pointer"
                            />
                            <span className="text-sm capitalize">
                              {status === "all" ? "Todos" : status}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              ({status === "all" 
                                ? projects.length 
                                : projects.filter(p => p.estado === status).length})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Botón limpiar filtros */}
                    {(selectedCategory !== "all" || selectedStatus !== "all" || searchTerm) && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedStatus("all");
                          setSearchTerm("");
                        }}
                      >
                        Limpiar filtros
                      </Button>
                    )}
                  </CollapsibleContent>
                </Collapsible>

                {/* Estadísticas */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <h4 className="font-semibold text-sm mb-3">Resumen</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total proyectos:</span>
                    <span className="font-semibold">{projects.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completados:</span>
                    <span className="font-semibold text-green-600">{completedProjects.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">En progreso:</span>
                    <span className="font-semibold text-blue-600">{inProgressProjects.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Galería de proyectos */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Nuestros Proyectos</h1>
              <p className="text-muted-foreground">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'proyecto encontrado' : 'proyectos encontrados'}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Cargando proyectos...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron proyectos</p>
              </div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">
                    Todos ({filteredProjects.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completados ({completedProjects.length})
                  </TabsTrigger>
                  <TabsTrigger value="progress">
                    En Progreso ({inProgressProjects.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                      <ProjectCard 
                        key={project._id || project.id} 
                        project={project} 
                        index={index}
                        onClick={() => onProjectClick(project._id || project.id || "")}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="completed">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedProjects.map((project, index) => (
                      <ProjectCard 
                        key={project._id || project.id} 
                        project={project} 
                        index={index}
                        onClick={() => onProjectClick(project._id || project.id || "")}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="progress">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inProgressProjects.map((project, index) => (
                      <ProjectCard 
                        key={project._id || project.id} 
                        project={project} 
                        index={index}
                        onClick={() => onProjectClick(project._id || project.id || "")}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full cursor-pointer" onClick={onClick}>
        <div className="relative">
          <AspectRatio ratio={16/10}>
            {getPrincipalImageUrl(project) ? (
              <img
                src={getPrincipalImageUrl(project)!}
                alt={project.titulo}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-3">
                <Wrench className="h-12 w-12 text-gray-400 animate-pulse" />
                <span className="text-gray-500 font-medium">En Mantenimiento</span>
                <span className="text-xs text-gray-400 px-4 text-center">Próximamente agregaremos imágenes de este proyecto</span>
              </div>
            )}
          </AspectRatio>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={project.estado?.toLowerCase().trim() === "completado" ? "default" : "secondary"} className="shadow-lg">
              {project.estado?.toLowerCase().trim() === "completado" ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <Clock className="h-3 w-3 mr-1" />
              )}
              {project.estado}
            </Badge>
          </div>
          
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="bg-white/90 shadow-lg">
              {project.categoria}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-5">
          <h3 className="font-semibold mb-3 line-clamp-1 text-lg group-hover:text-primary transition-colors">
            {project.titulo}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.descripcion}
          </p>
          
          <div className="space-y-2 text-sm">
            {project.ubicacion && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1">{project.ubicacion}</span>
              </div>
            )}
            
            {project.fechaFinalizacion && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>
                  {new Date(project.fechaFinalizacion).toLocaleDateString('es-MX', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>
            )}
          </div>
          
          <Button variant="ghost" className="w-full mt-4 group-hover:bg-primary group-hover:text-white transition-colors">
            Ver proyecto completo
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}