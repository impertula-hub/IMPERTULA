import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Calendar, CheckCircle, Clock, Wrench } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { projectApi, Project, ProjectImage } from "../lib/api";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { AspectRatio } from "./ui/aspect-ratio";
import backgroundImage from "figma:asset/d3d678ed3de5d7c79f508ad5d7b35231f3202b61.png";

interface WorkSectionProps {
  onProjectClick?: (projectId: string) => void;
  onViewAll?: () => void;
}

// Función utilitaria para obtener la URL de la imagen principal
const getPrincipalImageUrl = (
  project: Project,
): string | null => {
  // Prioridad 1: Buscar en imagenes array
  if (project.imagenes && project.imagenes.length > 0) {
    const principal =
      project.imagenes.find((img) => img.esPrincipal) ||
      project.imagenes[0];

    if (principal.tipo === "url" && principal.url) {
      return principal.url;
    } else if (
      principal.tipo === "base64" &&
      principal.data &&
      principal.mimeType
    ) {
      return `data:${principal.mimeType};base64,${principal.data}`;
    }
  }

  // Prioridad 2: URL legacy
  if (project.urlImagen) {
    return project.urlImagen;
  }

  return null;
};

// Componente individual de card de proyecto
function ProjectCard({ 
  project, 
  index, 
  onProjectClick 
}: { 
  project: Project; 
  index: number; 
  onProjectClick?: (projectId: string) => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Detectar si es móvil
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      setIsInitialized(true);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Si aún no se ha inicializado, no renderizar los efectos
  if (!isInitialized) {
    return null;
  }

  return (
    <motion.div
      key={project._id || project.id}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: index * 0.1,
        }
      }}
      viewport={{ once: true, amount: 0.2, margin: "-50px" }}
      whileHover={{ 
        scale: 1.03, 
        y: -8,
        transition: { duration: 0.3 }
      }}
      whileTap={{ 
        scale: 0.97,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div
        className="h-full"
        animate={isMobile ? {
          boxShadow: [
            "0 0 0px rgba(59, 130, 246, 0)",
            "0 0 25px rgba(59, 130, 246, 0.5)",
            "0 0 0px rgba(59, 130, 246, 0)"
          ]
        } : {
          boxShadow: "0 0 0px rgba(59, 130, 246, 0)"
        }}
        transition={isMobile ? {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        } : {
          duration: 0
        }}
      >
        <Card className={`overflow-hidden group h-full cursor-pointer bg-white/10 backdrop-blur-md transition-all duration-300
          ${isMobile 
            ? 'shadow-xl shadow-blue-500/20 bg-white/15 border-blue-500/30' 
            : 'border-white/20 hover:shadow-2xl hover:shadow-blue-500/30 hover:bg-white/20 hover:border-blue-500/50'
          }
        `}>
          <div
            className="relative"
            onClick={() =>
              onProjectClick?.( project._id || project.id || "")
            }
          >
            <AspectRatio ratio={16 / 10}>
              {getPrincipalImageUrl(project) ? (
                <motion.img
                  src={getPrincipalImageUrl(project)!}
                  alt={project.titulo}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
                  animate={isMobile ? {
                    scale: [1, 1.05, 1],
                    filter: [
                      "brightness(1)",
                      "brightness(1.1)",
                      "brightness(1)"
                    ]
                  } : {}}
                  transition={{
                    duration: 4,
                    repeat: isMobile ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src="https://images.unsplash.com/photo-1723474123029-98ec22febbeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBtYWludGVuYW5jZSUyMHRvb2xzfGVufDF8fHx8MTc2MjQwNzM2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="En mantenimiento"
                    className="w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-[#003366]/60 flex flex-col items-center justify-center gap-4 p-6">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Wrench className="h-16 w-16 text-white drop-shadow-lg" />
                    </motion.div>
                    <div className="text-center space-y-2">
                      <h4 className="text-white font-bold text-xl drop-shadow-md">
                        Galería en Construcción
                      </h4>
                      <p className="text-white/90 text-sm drop-shadow-sm">
                        Próximamente agregaremos
                        <br />
                        imágenes de este proyecto
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </AspectRatio>
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 
              ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            `} />

            <div className="absolute top-4 left-4">
              <Badge
                variant={
                  project.estado === "Completado"
                    ? "default"
                    : "secondary"
                }
                className="shadow-lg"
              >
                {project.estado === "Completado" ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                {project.estado}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge
                variant="outline"
                className="bg-white/90 shadow-lg"
              >
                {project.categoria}
              </Badge>
            </div>
          </div>

          <CardContent className="p-5">
            <motion.h3 
              className={`font-bold text-lg mb-2 transition-all duration-300 line-clamp-1 text-white
                group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]
                ${isMobile ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}
              `}
              animate={isMobile ? {
                textShadow: [
                  "0 0 8px rgba(59, 130, 246, 0.5)",
                  "0 0 12px rgba(59, 130, 246, 0.7)",
                  "0 0 8px rgba(59, 130, 246, 0.5)"
                ]
              } : {}}
              transition={{
                duration: 2,
                repeat: isMobile ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {project.titulo}
            </motion.h3>

            <p className={`text-sm mb-4 line-clamp-2 transition-colors duration-300
              text-white/80 group-hover:text-white/95
              ${isMobile ? 'text-white/95' : ''}
            `}>
              {project.descripcionCorta ||
                project.descripcion}
            </p>

            <div className="space-y-2 text-sm">
              {project.ubicacion && (
                <div className={`flex items-center gap-2 transition-colors duration-300
                  text-white/70 group-hover:text-white/90
                  ${isMobile ? 'text-white/90' : ''}
                `}>
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">
                    {project.ubicacion}
                  </span>
                </div>
              )}

              {(project.fechaFinalizacion ||
                project.fecha) && (
                <div className={`flex items-center gap-2 transition-colors duration-300
                  text-white/70 group-hover:text-white/90
                  ${isMobile ? 'text-white/90' : ''}
                `}>
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>
                    {project.fecha ||
                      new Date(
                        project.fechaFinalizacion,
                      ).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                      })}
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              className="w-full mt-4 bg-white/10 hover:bg-blue-500/30 hover:border-blue-500 text-white border border-white/20 transition-all duration-300"
              onClick={() =>
                onProjectClick?.(
                  project._id || project.id || "",
                )
              }
            >
              Ver Detalles
              <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export function WorkSection({
  onProjectClick,
  onViewAll,
}: WorkSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax effect para la imagen de fondo
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ["-8%", "8%"],
  );

  // Aplicar spring para suavizar el movimiento del parallax
  const smoothBackgroundY = useSpring(backgroundY, {
    stiffness: 50,
    damping: 40,
    mass: 1,
    restDelta: 0.001,
    restSpeed: 0.001
  });

  // Calcular estadísticas dinámicas basadas en proyectos
  const stats = {
    completed: projects.filter((p) => p.estado === "Completado")
      .length,
    total: projects.length,
    // Calcular años desde el proyecto más antiguo
    years: (() => {
      if (projects.length === 0) return 15;
      const dates = projects
        .filter((p) => p.fecha || p.fechaFinalizacion)
        .map((p) => {
          const dateStr = p.fecha || p.fechaFinalizacion;
          if (!dateStr) return null;
          return new Date(dateStr);
        })
        .filter(
          (d) => d !== null && !isNaN(d.getTime()),
        ) as Date[];

      if (dates.length === 0) return 15;
      const oldestYear = Math.min(
        ...dates.map((d) => d.getFullYear()),
      );
      const currentYear = new Date().getFullYear();
      return Math.max(currentYear - oldestYear, 15);
    })(),
    // Calcular m² totales si existe el campo area
    totalArea: (() => {
      const total = projects.reduce((sum, p) => {
        if (!p.area) return sum;
        // Extraer números del string de area (ej: "1,500 m²" -> 1500)
        const numStr = p.area.replace(/[^\d]/g, "");
        const num = parseInt(numStr);
        return sum + (isNaN(num) ? 0 : num);
      }, 0);
      return total > 0 ? total : 500000;
    })(),
    satisfaction: 98,
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectApi.getAll();
      // Asegurarse de que data sea un array
      if (Array.isArray(data)) {
        setProjects(data);
      } else if (data && typeof data === "object") {
        // Si la API devuelve {data: [...]} o similar
        const projectsArray =
          (data as any).data ||
          (data as any).proyectos ||
          (data as any).projects ||
          [];
        setProjects(
          Array.isArray(projectsArray) ? projectsArray : [],
        );
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

  return (
    <section
      ref={sectionRef}
      id="trabajos"
      className="py-32 md:py-40 relative overflow-hidden min-h-screen"
    >
      {/* Imagen de fondo con overlay y efecto parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{ 
            y: smoothBackgroundY,
            willChange: "transform"
          }}
        >
          <img
            src={backgroundImage}
            alt="Proyecto de impermeabilización"
            className="w-full h-full object-cover scale-125"
            style={{
              transform: "translateZ(0) translateY(-10%)",
              backfaceVisibility: "hidden",
              perspective: 1000,
              objectPosition: "center 40%"
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-6">
            Nuestros Trabajos
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Conoce algunos de nuestros proyectos más destacados
            en impermeabilización. Cada trabajo refleja nuestro
            compromiso con la calidad y la excelencia técnica.
          </p>
        </motion.div>

        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Cargando proyectos...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay proyectos disponibles
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project, index) => (
                <ProjectCard
                  key={project._id || project.id}
                  project={project}
                  index={index}
                  onProjectClick={onProjectClick}
                />
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button size="lg" onClick={onViewAll}>
            Ver Todos los Proyectos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Estadísticas integradas con el parallax */}
        <motion.div
          className="mt-10 md:mt-16 mb-12 md:mb-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.total > 0
                  ? `${stats.completed}+`
                  : "150+"}
              </h3>
              <p className="text-white/80 text-sm md:text-base">
                Proyectos Completados
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.years}+
              </h3>
              <p className="text-white/80 text-sm md:text-base">
                Años de Experiencia
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.totalArea > 0
                  ? `${(stats.totalArea / 1000).toFixed(0)}k+`
                  : "500k+"}
              </h3>
              <p className="text-white/80 text-sm md:text-base">
                m² Impermeabilizados
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.satisfaction}%
              </h3>
              <p className="text-white/80 text-sm md:text-base">
                Satisfacción del Cliente
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}