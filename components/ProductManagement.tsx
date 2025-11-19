import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Product, productApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll();
      // Asegurarse de que data sea un array
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && typeof data === 'object') {
        const productsArray = (data as any).data || (data as any).products || [];
        setProducts(Array.isArray(productsArray) ? productsArray : []);
      } else {
        setProducts([]);
      }
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
  };

  const handleEdit = (product: Product) => {
    const productId = product._id || product.id || "";
    setEditingId(productId as any);
    setFormData(product);
  };

  const handleSave = async () => {
    try {
      // Validaciones básicas
      if (!formData.name?.trim()) {
        toast.error("El nombre del producto es obligatorio");
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
      if (!formData.description?.trim()) {
        toast.error("La descripción es obligatoria");
        return;
      }

      if (isCreating) {
        const { _id, id, ...productData } = formData as any;
        // Asegurar que rating sea un número
        productData.rating = Number(productData.rating) || 5;
        
        console.log("Enviando producto:", productData);
        await productApi.create(productData);
        toast.success("Producto creado exitosamente");
      } else if (editingId) {
        const { _id, id, ...productData } = formData as any;
        productData.rating = Number(productData.rating) || 5;
        await productApi.update(editingId.toString(), productData);
        toast.success("Producto actualizado exitosamente");
      }
      await loadProducts();
      handleCancel();
    } catch (error: any) {
      console.error("Error al guardar producto:", error);
      toast.error(error.message || "Error al guardar el producto");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    
    try {
      await productApi.delete(id);
      toast.success("Producto eliminado exitosamente");
      await loadProducts();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar el producto");
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({});
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSpecification = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      } as any
    }));
  };

  const updateArrayField = (field: "features" | "applications", value: string) => {
    const items = value.split("\n").filter(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  if (loading) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Gestión de Productos</h2>
        {!isCreating && !editingId && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        )}
      </div>

      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? "Crear Nuevo Producto" : "Editar Producto"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="rating">Calificación (1-5) *</Label>
                <Select
                  value={String(formData.rating || 5)}
                  onValueChange={(value) => updateField("rating", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona calificación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">★★★★★ (5)</SelectItem>
                    <SelectItem value="4">★★★★☆ (4)</SelectItem>
                    <SelectItem value="3">★★★☆☆ (3)</SelectItem>
                    <SelectItem value="2">★★☆☆☆ (2)</SelectItem>
                    <SelectItem value="1">★☆☆☆☆ (1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de Imagen *</Label>
              <Input
                id="image"
                type="url"
                value={formData.image || ""}
                onChange={(e) => updateField("image", e.target.value)}
                placeholder="https://images.unsplash.com/..."
                required
              />
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
              <Label htmlFor="fullDescription">Descripción Completa</Label>
              <Textarea
                id="fullDescription"
                value={formData.fullDescription || ""}
                onChange={(e) => updateField("fullDescription", e.target.value)}
                rows={4}
                placeholder="Descripción detallada del producto, sus beneficios y usos"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="features">Características (una por línea)</Label>
                <Textarea
                  id="features"
                  value={formData.features?.join("\n") || ""}
                  onChange={(e) => updateArrayField("features", e.target.value)}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applications">Aplicaciones (una por línea)</Label>
                <Textarea
                  id="applications"
                  value={formData.applications?.join("\n") || ""}
                  onChange={(e) => updateArrayField("applications", e.target.value)}
                  rows={6}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Especificaciones Técnicas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="presentation">Presentación</Label>
                  <Input
                    id="presentation"
                    value={formData.specifications?.presentation || ""}
                    onChange={(e) => updateSpecification("presentation", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverage">Rendimiento</Label>
                  <Input
                    id="coverage"
                    value={formData.specifications?.coverage || ""}
                    onChange={(e) => updateSpecification("coverage", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dryingTime">Tiempo de Secado</Label>
                  <Input
                    id="dryingTime"
                    value={formData.specifications?.dryingTime || ""}
                    onChange={(e) => updateSpecification("dryingTime", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colors">Colores</Label>
                  <Input
                    id="colors"
                    value={formData.specifications?.colors || ""}
                    onChange={(e) => updateSpecification("colors", e.target.value)}
                  />
                </div>
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
        {products.map((product) => (
          <Card key={product._id || product.id} className="overflow-hidden">
            {product.image.startsWith('http') ? (
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
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

      {products.length === 0 && !isCreating && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No hay productos registrados</p>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Primer Producto
          </Button>
        </Card>
      )}
    </div>
  );
}
