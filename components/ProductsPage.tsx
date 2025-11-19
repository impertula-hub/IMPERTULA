import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  ArrowLeft,
  Grid3x3,
  List,
  ChevronDown
} from "lucide-react";
import { motion } from "motion/react";
import { productApi, Product } from "../lib/api";
import { ImageWithFallback } from "./figma/ImageWithFallback";
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

interface ProductsPageProps {
  onBack: () => void;
  onProductClick: (productId: string) => void;
}

export function ProductsPage({ onBack, onProductClick }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, selectedBrand, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll();
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && typeof data === 'object') {
        const productsArray = (data as any).data || (data as any).products || [];
        setProducts(Array.isArray(productsArray) ? productsArray : []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtro de marca
    if (selectedBrand !== "all") {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];
  const brands = ["all", ...Array.from(new Set(products.map(p => p.brand)))];

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
              <span>Productos</span>
            </div>
          </div>

          {/* Barra de búsqueda y controles */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="name-desc">Nombre Z-A</SelectItem>
                  <SelectItem value="rating">Mejor calificado</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
              </Button>
            </div>
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
                                ? products.length 
                                : products.filter(p => p.category === category).length})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Filtro por marca */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm">Marca</h4>
                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <label
                            key={brand}
                            className="flex items-center gap-2 cursor-pointer hover:text-primary"
                          >
                            <input
                              type="radio"
                              name="brand"
                              value={brand}
                              checked={selectedBrand === brand}
                              onChange={(e) => setSelectedBrand(e.target.value)}
                              className="cursor-pointer"
                            />
                            <span className="text-sm capitalize">
                              {brand === "all" ? "Todas" : brand}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              ({brand === "all" 
                                ? products.length 
                                : products.filter(p => p.brand === brand).length})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Botón limpiar filtros */}
                    {(selectedCategory !== "all" || selectedBrand !== "all" || searchTerm) && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedBrand("all");
                          setSearchTerm("");
                        }}
                      >
                        Limpiar filtros
                      </Button>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </aside>

          {/* Grid de productos */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Todos los Productos</h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Cargando productos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron productos</p>
              </div>
            ) : (
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id || product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {viewMode === "grid" ? (
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => onProductClick(product._id || product.id || "")}>
                        <div className="relative">
                          {product.image.startsWith('http') ? (
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="w-full h-56 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-56 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute top-3 left-3">
                            <Badge className={
                              product.brand === 'Fester' 
                                ? 'bg-blue-600' 
                                : 'bg-green-600'
                            }>
                              {product.brand}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            <Badge variant="secondary">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < product.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <Button size="sm" variant="ghost">
                              Ver detalles
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => onProductClick(product._id || product.id || "")}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-32 h-32 shrink-0">
                              {product.image.startsWith('http') ? (
                                <ImageWithFallback
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold mb-1">{product.name}</h3>
                                  <div className="flex gap-2 mb-2">
                                    <Badge className={
                                      product.brand === 'Fester' 
                                        ? 'bg-blue-600' 
                                        : 'bg-green-600'
                                    }>
                                      {product.brand}
                                    </Badge>
                                    <Badge variant="secondary">
                                      {product.category}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < product.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {product.description}
                              </p>
                              <Button size="sm">Ver detalles</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
