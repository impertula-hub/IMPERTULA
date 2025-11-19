import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Edit, Trash2, Save, X, Upload, Link as LinkIcon, Star, Image as ImageIcon } from "lucide-react";
import { Project, ProjectImage, projectApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [imageType, setImageType] = useState<'url' | 'base64'>('url');
  const [newImageData, setNewImageData] = useState<Partial<ProjectImage>>({});

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
      } else if (data && typeof data === 'object') {
        const projectsArray = (data as any).data || (data as any).proyectos || (data as any).projects || [];
        setProjects(Array.isArray(projectsArray) ? projectsArray : []);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
      toast.error("Error al cargar proyectos");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      titulo: "",
      ubicacion: "",
      categoria: "Industrial",
      estado: "En Proceso",
      cliente: "",
      duracion: "",
      area: "",
      equipo: "",
      descripcionCorta: "",
      imagenes: [],
      // Campos opcionales se omiten o se dejan vacíos
      fecha: "",
      urlImagen: "",
      descripcionCompleta: "",
      desafios: "",
      soluciones: "",
      resultados: "",
      productosUtilizados: ""
    });
    setImageType('url');
    setNewImageData({});
  };

  const handleEdit = (project: Project) => {
    const projectId = project._id || project.id || "";
    setEditingId(projectId as any);
    setFormData(project);
  };

  const handleSave = async () => {
    try {
      // Validaciones de campos obligatorios
      if (!formData.titulo?.trim()) {
        toast.error("El título es obligatorio");
        return;
      }
      if (!formData.ubicacion?.trim()) {
        toast.error("La ubicación es obligatoria");
        return;
      }
      if (!formData.categoria) {
        toast.error("La categoría es obligatoria");
        return;
      }
      if (!formData.estado) {
        toast.error("El estado es obligatorio");
        return;
      }
      if (!formData.cliente?.trim()) {
        toast.error("El cliente es obligatorio");
        return;
      }
      if (!formData.duracion?.trim()) {
        toast.error("La duración es obligatoria");
        return;
      }
      if (!formData.area?.trim()) {
        toast.error("El área es obligatoria");
        return;
      }
      if (!formData.equipo?.trim()) {
        toast.error("El equipo es obligatorio");
        return;
      }
      if (!formData.descripcionCorta?.trim()) {
        toast.error("La descripción corta es obligatoria");
        return;
      }

      if (isCreating) {
        const { _id, id, ...projectData } = formData as any;
        // Limpiar campos vacíos para no enviar strings vacíos
        const cleanData = Object.entries(projectData).reduce((acc, [key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            // Para arrays (como imagenes), incluir aunque esté vacío
            if (Array.isArray(value) || key === 'imagenes') {
              acc[key] = value;
            } else {
              acc[key] = value;
            }
          }
          return acc;
        }, {} as any);
        
        // Validar que las imágenes tengan el campo tipo
        if (cleanData.imagenes && Array.isArray(cleanData.imagenes)) {
          cleanData.imagenes = cleanData.imagenes.map((img: any) => {
            // Asegurar que cada imagen tenga el campo tipo
            if (!img.tipo) {
              img.tipo = img.data ? 'base64' : 'url';
            }
            return img;
          });
        }
        
        console.log("Enviando proyecto:", {
          ...cleanData,
          imagenes: cleanData.imagenes?.map((img: any) => ({
            tipo: img.tipo,
            nombre: img.nombre,
            tieneData: !!img.data,
            tieneUrl: !!img.url,
            tamañoData: img.data?.length || 0
          }))
        });
        await projectApi.create(cleanData);
        toast.success("Proyecto creado exitosamente");
      } else if (editingId) {
        const { _id, id, ...projectData } = formData as any;
        
        // Validar que las imágenes tengan el campo tipo
        if (projectData.imagenes && Array.isArray(projectData.imagenes)) {
          projectData.imagenes = projectData.imagenes.map((img: any) => {
            if (!img.tipo) {
              img.tipo = img.data ? 'base64' : 'url';
            }
            return img;
          });
        }
        
        await projectApi.update(editingId.toString(), projectData);
        toast.success("Proyecto actualizado exitosamente");
      }
      await loadProjects();
      handleCancel();
    } catch (error: any) {
      console.error("Error al guardar proyecto:", error);
      toast.error(error.message || "Error al guardar el proyecto");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;
    
    try {
      await projectApi.delete(id);
      toast.success("Proyecto eliminado exitosamente");
      await loadProjects();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar el proyecto");
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({});
    setImageType('url');
    setNewImageData({});
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // No necesitamos convertir a arrays, la API espera strings
  const updateTextField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Convertir archivo a Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Manejar carga de archivo local
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      return;
    }

    // Validar tamaño (máximo 2MB para evitar problemas con MongoDB)
    // Base64 aumenta el tamaño en ~33%, y MongoDB tiene límite de 16MB por documento
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error(`La imagen excede el tamaño máximo permitido (2MB). Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      // Extraer solo el data sin el prefijo data:image/...;base64,
      const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        setNewImageData({
          nombre: file.name,
          tipo: 'base64',
          mimeType: matches[1],
          data: matches[2],
          size: file.size,
          esPrincipal: false
        });
      }
    } catch (error) {
      toast.error('Error al procesar la imagen');
      console.error(error);
    }
  };

  // Agregar imagen al proyecto
  const handleAddImage = () => {
    if (imageType === 'url') {
      if (!newImageData.url?.trim()) {
        toast.error('Ingresa una URL válida');
        return;
      }
      
      // Validar formato básico de URL
      try {
        new URL(newImageData.url);
      } catch {
        toast.error('URL inválida');
        return;
      }
    } else {
      if (!newImageData.data) {
        toast.error('Selecciona una imagen');
        return;
      }
    }

    const newImage: ProjectImage = {
      ...newImageData,
      tipo: imageType,
      esPrincipal: (formData.imagenes?.length || 0) === 0 // Primera imagen es principal por defecto
    } as ProjectImage;

    setFormData(prev => ({
      ...prev,
      imagenes: [...(prev.imagenes || []), newImage]
    }));

    // Limpiar formulario de imagen
    setNewImageData({});
    toast.success('Imagen agregada');
  };

  // Eliminar imagen
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes?.filter((_, i) => i !== index)
    }));
    toast.success('Imagen eliminada');
  };

  // Marcar imagen como principal
  const handleSetPrincipal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes?.map((img, i) => ({
        ...img,
        esPrincipal: i === index
      }))
    }));
  };

  // Obtener URL de imagen para preview
  const getImagePreviewUrl = (img: ProjectImage): string => {
    if (img.tipo === 'url' && img.url) {
      return img.url;
    } else if (img.tipo === 'base64' && img.data && img.mimeType) {
      return `data:${img.mimeType};base64,${img.data}`;
    }
    return '';
  };

  // Obtener imagen principal del proyecto
  const getPrincipalImage = (project: Project): string | null => {
    // Prioridad 1: Buscar en imagenes array
    if (project.imagenes && project.imagenes.length > 0) {
      const principal = project.imagenes.find(img => img.esPrincipal) || project.imagenes[0];
      return getImagePreviewUrl(principal);
    }
    // Prioridad 2: URL legacy
    if (project.urlImagen) {
      return project.urlImagen;
    }
    return null;
  };

  if (loading) {
    return <div className="text-center py-8">Cargando proyectos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Gestión de Proyectos</h2>
        {!isCreating && !editingId && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Proyecto
          </Button>
        )}
      </div>

      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? "Crear Nuevo Proyecto" : "Editar Proyecto"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título del Proyecto *</Label>
                <Input
                  id="titulo"
                  value={(formData as any).titulo || ""}
                  onChange={(e) => updateField("titulo", e.target.value)}
                  placeholder="Ej: Centro Comercial Plaza Norte"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación *</Label>
                <Input
                  id="ubicacion"
                  value={(formData as any).ubicacion || ""}
                  onChange={(e) => updateField("ubicacion", e.target.value)}
                  placeholder="Ej: Guadalajara, Jalisco"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha (Ejemplo: Junio 2024)</Label>
                <Input
                  id="fecha"
                  type="text"
                  value={(formData as any).fecha || ""}
                  onChange={(e) => updateField("fecha", e.target.value)}
                  placeholder="Ej: Junio 2024, Enero 2023, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría *</Label>
                <Select
                  value={(formData as any).categoria || "Industrial"}
                  onValueChange={(value) => updateField("categoria", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                    <SelectItem value="Residencial">Residencial</SelectItem>
                    <SelectItem value="Infraestructura">Infraestructura</SelectItem>
                    <SelectItem value="Educativo">Educativo</SelectItem>
                    <SelectItem value="Hospitalario">Hospitalario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Select
                  value={(formData as any).estado || "En Proceso"}
                  onValueChange={(value) => updateField("estado", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En Proceso">En Proceso</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Pausado">Pausado</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Input
                  id="cliente"
                  value={(formData as any).cliente || ""}
                  onChange={(e) => updateField("cliente", e.target.value)}
                  placeholder="Ej: Grupo Empresarial XYZ S.A."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracion">Duración *</Label>
                <Input
                  id="duracion"
                  value={(formData as any).duracion || ""}
                  onChange={(e) => updateField("duracion", e.target.value)}
                  placeholder="Ej: 8 meses"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área *</Label>
                <Input
                  id="area"
                  value={(formData as any).area || ""}
                  onChange={(e) => updateField("area", e.target.value)}
                  placeholder="Ej: 3,500 m²"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipo">Equipo *</Label>
                <Input
                  id="equipo"
                  value={(formData as any).equipo || ""}
                  onChange={(e) => updateField("equipo", e.target.value)}
                  placeholder="Ej: 20 especialistas"
                  required
                />
              </div>
            </div>

            <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center justify-between">
                <Label className="text-base">Imágenes del Proyecto</Label>
                <Badge variant="outline">
                  {formData.imagenes?.length || 0} imagen(es)
                </Badge>
              </div>

              <Tabs value={imageType} onValueChange={(v) => setImageType(v as 'url' | 'base64')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url" className="gap-2">
                    <LinkIcon className="h-4 w-4" />
                    URL
                  </TabsTrigger>
                  <TabsTrigger value="base64" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Archivo Local
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="space-y-3 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL de la Imagen</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newImageData.url || ""}
                      onChange={(e) => setNewImageData(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageName">Nombre (opcional)</Label>
                    <Input
                      id="imageName"
                      placeholder="Ej: Fachada principal"
                      value={newImageData.nombre || ""}
                      onChange={(e) => setNewImageData(prev => ({ ...prev, nombre: e.target.value }))}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddImage}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar Imagen desde URL
                  </Button>
                </TabsContent>

                <TabsContent value="base64" className="space-y-3 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageFile">Seleccionar Archivo</Label>
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-muted-foreground">
                      Tamaño máximo: 2MB. Formatos: JPG, PNG, GIF, WebP
                    </p>
                    <p className="text-xs text-blue-600">
                      💡 Para imágenes más grandes, usa URLs externas
                    </p>
                  </div>
                  {newImageData.data && (
                    <div className="space-y-2">
                      <Label>Vista Previa</Label>
                      <div className="border rounded-lg overflow-hidden">
                        <img
                          src={`data:${newImageData.mimeType};base64,${newImageData.data}`}
                          alt="Preview"
                          className="w-full h-40 object-cover"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {newImageData.nombre} - {((newImageData.size || 0) / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  )}
                  <Button
                    type="button"
                    onClick={handleAddImage}
                    variant="outline"
                    className="w-full gap-2"
                    disabled={!newImageData.data}
                  >
                    <Plus className="h-4 w-4" />
                    Agregar Imagen Local
                  </Button>
                </TabsContent>
              </Tabs>

              {/* Lista de imágenes agregadas */}
              {formData.imagenes && formData.imagenes.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <Label>Imágenes agregadas</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.imagenes.map((img, index) => (
                      <div
                        key={index}
                        className="relative border rounded-lg overflow-hidden group"
                      >
                        <img
                          src={getImagePreviewUrl(img)}
                          alt={img.nombre || `Imagen ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={img.esPrincipal ? "default" : "secondary"}
                            onClick={() => handleSetPrincipal(index)}
                            className="gap-1"
                          >
                            <Star className={`h-3 w-3 ${img.esPrincipal ? 'fill-current' : ''}`} />
                            {img.esPrincipal ? 'Principal' : 'Marcar'}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge variant={img.tipo === 'url' ? 'default' : 'secondary'} className="text-xs">
                            {img.tipo === 'url' ? 'URL' : 'Local'}
                          </Badge>
                        </div>
                        {img.esPrincipal && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="default" className="text-xs gap-1">
                              <Star className="h-3 w-3 fill-current" />
                            </Badge>
                          </div>
                        )}
                        <div className="p-2 bg-background/95">
                          <p className="text-xs truncate">
                            {img.nombre || `Imagen ${index + 1}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcionCorta">Descripción Corta *</Label>
              <Textarea
                id="descripcionCorta"
                value={(formData as any).descripcionCorta || ""}
                onChange={(e) => updateField("descripcionCorta", e.target.value)}
                rows={2}
                placeholder="Breve descripción del proyecto (1-2 líneas)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcionCompleta">Descripción Completa</Label>
              <Textarea
                id="descripcionCompleta"
                value={(formData as any).descripcionCompleta || ""}
                onChange={(e) => updateField("descripcionCompleta", e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="desafios">Desafíos</Label>
                <Textarea
                  id="desafios"
                  value={(formData as any).desafios || ""}
                  onChange={(e) => updateTextField("desafios", e.target.value)}
                  rows={5}
                  placeholder="Desafíos del proyecto..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="soluciones">Soluciones</Label>
                <Textarea
                  id="soluciones"
                  value={(formData as any).soluciones || ""}
                  onChange={(e) => updateTextField("soluciones", e.target.value)}
                  rows={5}
                  placeholder="Soluciones implementadas..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resultados">Resultados</Label>
                <Textarea
                  id="resultados"
                  value={(formData as any).resultados || ""}
                  onChange={(e) => updateTextField("resultados", e.target.value)}
                  rows={5}
                  placeholder="Resultados obtenidos..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productosUtilizados">Productos Utilizados</Label>
                <Textarea
                  id="productosUtilizados"
                  value={(formData as any).productosUtilizados || ""}
                  onChange={(e) => updateTextField("productosUtilizados", e.target.value)}
                  rows={5}
                  placeholder="Productos utilizados en el proyecto..."
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Los campos marcados con * son obligatorios
              </p>
              <div className="flex gap-3">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Guardar
                </Button>
                <Button onClick={handleCancel} variant="outline" className="gap-2">
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const principalImage = getPrincipalImage(project);
          return (
          <Card key={project._id || project.id} className="overflow-hidden">
            {principalImage ? (
              <div className="relative">
                <img
                  src={principalImage}
                  alt={project.titulo}
                  className="w-full h-48 object-cover"
                />
                {project.imagenes && project.imagenes.length > 1 && (
                  <Badge className="absolute top-2 right-2 gap-1">
                    <ImageIcon className="h-3 w-3" />
                    {project.imagenes.length}
                  </Badge>
                )}
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-muted-foreground">Sin imagen</span>
              </div>
            )}
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{project.titulo}</h3>
                  <div className="flex gap-2 mb-2">
                    <Badge variant={project.estado === "Completado" ? "default" : "secondary"}>
                      {project.estado}
                    </Badge>
                    <Badge variant="outline">{project.categoria}</Badge>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                📍 {project.ubicacion}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {project.descripcionCorta}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(project)}
                  className="flex-1 gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(project._id || project.id || "")}
                  className="gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )})}
      </div>

      {projects.length === 0 && !isCreating && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No hay proyectos registrados</p>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Primer Proyecto
          </Button>
        </Card>
      )}
    </div>
  );
}