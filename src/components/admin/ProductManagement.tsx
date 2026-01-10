import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Plus, Edit, Trash2, Save, X, AlertTriangle, Upload, Link as LinkIcon } from "lucide-react";
import { Product, productApi } from "../../lib/api";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ProductManagementProps {
  onFormStateChange?: (isOpen: boolean) => void;
}

export function ProductManagement({ onFormStateChange }: ProductManagementProps = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [imageInputType, setImageInputType] = useState<"url" | "file">("url");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  // Notificar al padre cuando se abre o cierra un formulario
  useEffect(() => {
    const isFormOpen = isCreating || editingId !== null;
    onFormStateChange?.(isFormOpen);
  }, [isCreating, editingId, onFormStateChange]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll();
      // productApi.getAll() ya devuelve un array directamente
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("Error al cargar productos");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      name: "",
      category: "",
      description: "",
      image: "",
      brand: "Fester",
      rating: 5,
      fullDescription: "",
      features: [],
      applications: [],
      specifications: {
        presentation: "",
        coverage: "",
        dryingTime: "",
        colors: ""
      }
    });
    setHasUnsavedChanges(false);
  };

  const handleEdit = (product: Product) => {
    const productId = product._id || product.id || "";
    setEditingId(productId);
    setFormData(product);
    setHasUnsavedChanges(false);
  };

  // Función de validación para campos de texto
  const validateTextField = (value: string, fieldName: string): { valid: boolean; error?: string } => {
    const trimmed = value.trim();
    
    // Verificar que no esté vacío
    if (!trimmed) {
      return { valid: false, error: `${fieldName} es obligatorio` };
    }
    
    // Verificar que tenga al menos 3 caracteres
    if (trimmed.length < 3) {
      return { valid: false, error: `${fieldName} debe tener al menos 3 caracteres` };
    }
    
    // Verificar que contenga al menos algunas letras o números (no solo símbolos)
    const hasValidContent = /[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]{2,}/.test(trimmed);
    if (!hasValidContent) {
      return { valid: false, error: `${fieldName} debe contener texto válido (no solo símbolos)` };
    }
    
    // Verificar que no sea solo caracteres repetidos
    const uniqueChars = new Set(trimmed.replace(/\s/g, ''));
    if (uniqueChars.size < 2) {
      return { valid: false, error: `${fieldName} no puede contener solo caracteres repetidos` };
    }
    
    return { valid: true };
  };

  // Validar URL de imagen
  const validateImageUrl = (url: string): { valid: boolean; error?: string } => {
    const trimmed = url.trim();
    
    if (!trimmed) {
      return { valid: false, error: "La imagen es obligatoria" };
    }
    
    // Si es base64, validar formato
    if (trimmed.startsWith('data:image')) {
      return { valid: true };
    }
    
    // Si es URL, validar formato básico
    try {
      new URL(trimmed);
      return { valid: true };
    } catch {
      return { valid: false, error: "La URL de la imagen no es válida" };
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validaciones robustas - TODOS LOS CAMPOS OBLIGATORIOS
      const nameValidation = validateTextField(formData.name || "", "El nombre del producto");
      if (!nameValidation.valid) {
        toast.error(nameValidation.error);
        return;
      }

      if (!formData.category?.trim()) {
        toast.error("La categoría es obligatoria");
        return;
      }
      
      if (!formData.brand) {
        toast.error("La marca es obligatoria");
        return;
      }

      const descriptionValidation = validateTextField(formData.description || "", "La descripción corta");
      if (!descriptionValidation.valid) {
        toast.error(descriptionValidation.error);
        return;
      }

      const imageValidation = validateImageUrl(formData.image || "");
      if (!imageValidation.valid) {
        toast.error(imageValidation.error);
        return;
      }

      // Validar descripción completa (ahora obligatoria)
      const fullDescriptionValidation = validateTextField(formData.fullDescription || "", "La descripción completa");
      if (!fullDescriptionValidation.valid) {
        toast.error(fullDescriptionValidation.error);
        return;
      }

      // Validar características (ahora obligatorias - al menos una)
      if (!formData.features || formData.features.length === 0 || !formData.features.some(f => f.trim())) {
        toast.error("Debe agregar al menos una característica del producto");
        return;
      }

      // Validar aplicaciones (ahora obligatorias - al menos una)
      if (!formData.applications || formData.applications.length === 0 || !formData.applications.some(a => a.trim())) {
        toast.error("Debe agregar al menos una aplicación del producto");
        return;
      }

      // Validar especificaciones técnicas (todas obligatorias)
      if (!formData.specifications?.presentation?.trim()) {
        toast.error("La presentación en especificaciones técnicas es obligatoria");
        return;
      }

      const presentationValidation = validateTextField(formData.specifications.presentation, "La presentación");
      if (!presentationValidation.valid) {
        toast.error(presentationValidation.error);
        return;
      }

      if (!formData.specifications?.coverage?.trim()) {
        toast.error("El rendimiento en especificaciones técnicas es obligatorio");
        return;
      }

      const coverageValidation = validateTextField(formData.specifications.coverage, "El rendimiento");
      if (!coverageValidation.valid) {
        toast.error(coverageValidation.error);
        return;
      }

      if (!formData.specifications?.dryingTime?.trim()) {
        toast.error("El tiempo de secado en especificaciones técnicas es obligatorio");
        return;
      }

      const dryingTimeValidation = validateTextField(formData.specifications.dryingTime, "El tiempo de secado");
      if (!dryingTimeValidation.valid) {
        toast.error(dryingTimeValidation.error);
        return;
      }

      if (!formData.specifications?.colors?.trim()) {
        toast.error("Los colores en especificaciones técnicas son obligatorios");
        return;
      }

      const colorsValidation = validateTextField(formData.specifications.colors, "Los colores");
      if (!colorsValidation.valid) {
        toast.error(colorsValidation.error);
        return;
      }

      if (isCreating) {
        // Eliminar campos que no son necesarios y sanitizar datos
        const { _id, id, ...productData } = formData as any;
        
        // Asegurar que todos los campos requeridos estén presentes
        const sanitizedProduct = {
          name: productData.name.trim(),
          category: productData.category.trim(),
          description: productData.description.trim(),
          image: productData.image.trim(),
          brand: productData.brand,
          rating: Number(productData.rating) || 5,
          fullDescription: productData.fullDescription?.trim() || "",
          features: Array.isArray(productData.features) ? productData.features.filter((f: string) => f.trim()) : [],
          applications: Array.isArray(productData.applications) ? productData.applications.filter((a: string) => a.trim()) : [],
          specifications: {
            presentation: productData.specifications?.presentation?.trim() || "",
            coverage: productData.specifications?.coverage?.trim() || "",
            dryingTime: productData.specifications?.dryingTime?.trim() || "",
            colors: productData.specifications?.colors?.trim() || ""
          }
        };
        
        console.log("📤 Enviando producto sanitizado:", sanitizedProduct);
        const result = await productApi.create(sanitizedProduct);
        console.log("✅ Producto creado:", result);
        toast.success("Producto creado exitosamente");
        
        // Recargar productos y resetear estado completamente
        await loadProducts();
        confirmCancel(); // Usar confirmCancel() directamente para evitar el diálogo de advertencia
      } else if (editingId) {
        const { _id, id, ...productData } = formData as any;
        
        // Sanitizar datos para actualización
        const sanitizedProduct = {
          name: productData.name.trim(),
          category: productData.category.trim(),
          description: productData.description.trim(),
          image: productData.image.trim(),
          brand: productData.brand,
          rating: Number(productData.rating) || 5,
          fullDescription: productData.fullDescription?.trim() || "",
          features: Array.isArray(productData.features) ? productData.features.filter((f: string) => f.trim()) : [],
          applications: Array.isArray(productData.applications) ? productData.applications.filter((a: string) => a.trim()) : [],
          specifications: {
            presentation: productData.specifications?.presentation?.trim() || "",
            coverage: productData.specifications?.coverage?.trim() || "",
            dryingTime: productData.specifications?.dryingTime?.trim() || "",
            colors: productData.specifications?.colors?.trim() || ""
          }
        };
        
        await productApi.update(editingId.toString(), sanitizedProduct);
        toast.success("Producto actualizado exitosamente");
        
        // Recargar productos y resetear estado completamente
        await loadProducts();
        confirmCancel(); // Usar confirmCancel() directamente para evitar el diálogo de advertencia
      }
    } catch (error: any) {
      console.error("❌ Error al guardar producto:", error);
      toast.error(error.message || "Error al guardar el producto");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setProductToDelete(id);
    setShowDeleteWarning(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await productApi.delete(productToDelete);
      toast.success("Producto eliminado exitosamente");
      await loadProducts();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar el producto");
    } finally {
      setShowDeleteWarning(false);
      setProductToDelete(null);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowExitWarning(true);
    } else {
      confirmCancel();
    }
  };

  const confirmCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({});
    setHasUnsavedChanges(false);
    setShowExitWarning(false);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const updateSpecification = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      } as any
    }));
    setHasUnsavedChanges(true);
  };

  const updateArrayField = (field: "features" | "applications", value: string) => {
    const items = value.split("\n").filter(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: items }));
    setHasUnsavedChanges(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        updateField("image", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setSelectedFile(null);
    updateField("image", "");
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  const isFormOpen = isCreating || editingId !== null;

  // MODO LISTA - VISTA NORMAL
  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">Gestión de Productos</h2>
          <Button onClick={handleCreate} className="gap-2 bg-[#EC1C24] hover:bg-[#B71C1C]">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product._id || product.id} className="overflow-hidden">
              {product.image ? (
                <div className="w-full aspect-[4/3]">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
                  <span className="text-muted-foreground">Sin imagen</span>
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline">{product.brand}</Badge>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {product.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="flex-1 gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product._id || product.id || "")}
                    className="gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No hay productos registrados</p>
            <Button onClick={handleCreate} className="gap-2 bg-[#EC1C24] hover:bg-[#B71C1C]">
              <Plus className="h-4 w-4" />
              Crear Primer Producto
            </Button>
          </Card>
        )}
      </div>

      {/* Modal de Formulario de Producto */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">
                {isCreating ? "Crear Nuevo Producto" : "Editar Producto"}
              </DialogTitle>
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Cambios sin guardar
                </Badge>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Ej: Impermeabilizante Acrílico Premium"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => updateField("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Impermeabilizantes">Impermeabilizantes</SelectItem>
                    <SelectItem value="Selladores">Selladores</SelectItem>
                    <SelectItem value="Adhesivos">Adhesivos</SelectItem>
                    <SelectItem value="Recubrimientos">Recubrimientos</SelectItem>
                    <SelectItem value="Membranas">Membranas</SelectItem>
                    <SelectItem value="Morteros">Morteros</SelectItem>
                    <SelectItem value="Pinturas">Pinturas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Select
                  value={formData.brand || "Fester"}
                  onValueChange={(value) => updateField("brand", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fester">Fester</SelectItem>
                    <SelectItem value="Henkel">Henkel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagen del Producto *</Label>
              <Tabs value={imageInputType} onValueChange={(v) => setImageInputType(v as "url" | "file")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="file">Archivo</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="space-y-2">
                  <Input
                    id="image"
                    type="url"
                    value={formData.image && !formData.image.startsWith('data:') ? formData.image : ""}
                    onChange={(e) => {
                      updateField("image", e.target.value);
                      setImagePreview("");
                    }}
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                  {formData.image && !formData.image.startsWith('data:') && (
                    <div className="space-y-2">
                      <div className="border rounded-lg overflow-hidden w-full max-w-md">
                        <div className="aspect-[4/3]">
                          <ImageWithFallback
                            src={formData.image}
                            alt="Vista previa"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={handleRemoveImage}
                        className="gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Eliminar imagen
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="file" className="space-y-3">
                  {!formData.image || !formData.image.startsWith('data:') ? (
                    <div className="space-y-3">
                      <label
                        htmlFor="product-file-upload"
                        className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#EC1C24] hover:bg-gray-50 transition-all"
                      >
                        <Upload className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="mb-1 text-sm font-medium text-gray-700">
                          Haz clic aquí para seleccionar una imagen
                        </p>
                        <p className="text-xs text-gray-500">
                          O arrastra y suelta una imagen
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          JPG, PNG, GIF (Máx. 5MB)
                        </p>
                      </label>
                      <Input
                        id="product-file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="border rounded-lg overflow-hidden w-full">
                        <div className="aspect-[4/3]">
                          <ImageWithFallback
                            src={formData.image}
                            alt="Vista previa"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={handleRemoveImage}
                          className="gap-2 flex-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => document.getElementById('product-file-upload')?.click()}
                          className="gap-2 flex-1"
                        >
                          <Upload className="h-4 w-4" />
                          Cambiar
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción Corta *</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                rows={2}
                placeholder="Descripción breve del producto (1-2 líneas)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Descripción Completa *</Label>
              <Textarea
                id="fullDescription"
                value={formData.fullDescription || ""}
                onChange={(e) => updateField("fullDescription", e.target.value)}
                rows={4}
                placeholder="Descripción detallada del producto, sus beneficios y usos"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="features">Características (una por línea) *</Label>
                <Textarea
                  id="features"
                  value={formData.features?.join("\n") || ""}
                  onChange={(e) => updateArrayField("features", e.target.value)}
                  rows={6}
                  placeholder="Alta resistencia&#10;Fácil aplicación&#10;Secado rápido"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applications">Aplicaciones (una por línea) *</Label>
                <Textarea
                  id="applications"
                  value={formData.applications?.join("\n") || ""}
                  onChange={(e) => updateArrayField("applications", e.target.value)}
                  rows={6}
                  placeholder="Techos&#10;Terrazas&#10;Muros"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Especificaciones Técnicas *</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="presentation">Presentación *</Label>
                  <Input
                    id="presentation"
                    value={formData.specifications?.presentation || ""}
                    onChange={(e) => updateSpecification("presentation", e.target.value)}
                    placeholder="Cubeta de 19L, Tambor de 200L"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverage">Rendimiento *</Label>
                  <Input
                    id="coverage"
                    value={formData.specifications?.coverage || ""}
                    onChange={(e) => updateSpecification("coverage", e.target.value)}
                    placeholder="4-5 m² por litro"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dryingTime">Tiempo de Secado *</Label>
                  <Input
                    id="dryingTime"
                    value={formData.specifications?.dryingTime || ""}
                    onChange={(e) => updateSpecification("dryingTime", e.target.value)}
                    placeholder="4-6 horas"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colors">Colores *</Label>
                  <Input
                    id="colors"
                    value={formData.specifications?.colors || ""}
                    onChange={(e) => updateSpecification("colors", e.target.value)}
                    placeholder="Blanco, Rojo, Terracota"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Los campos marcados con * son obligatorios
              </p>
              <div className="flex gap-3 justify-end">
                <Button onClick={handleCancel} variant="outline" className="gap-2 min-w-32">
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="gap-2 min-w-32 bg-[#EC1C24] hover:bg-[#B71C1C]" disabled={isSaving}>
                  <Save className="h-4 w-4" />
                  {isSaving ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para salir sin guardar */}
      <AlertDialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
            <AlertDialogDescription>
              Tienes cambios sin guardar. Si sales ahora, perderás todos los cambios realizados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-destructive hover:bg-destructive/90">
              Descartar cambios
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmación para eliminar producto */}
      <AlertDialog open={showDeleteWarning} onOpenChange={setShowDeleteWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este producto?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}