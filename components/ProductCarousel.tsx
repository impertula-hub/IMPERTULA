import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { ArrowRight, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { productApi, Product } from "../lib/api";
import Autoplay from "embla-carousel-autoplay@8.6.0";

interface ProductCarouselProps {
  onProductClick?: (productId: string) => void;
  onViewAll?: () => void;
}

export function ProductCarousel({ onProductClick, onViewAll }: ProductCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
        // Si la API devuelve {data: [...]} o similar
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
  return (
    <section id="productos" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4">Nuestros Productos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Descubre nuestra amplia gama de productos de impermeabilización y aditivos 
            de las marcas más reconocidas del mercado
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay productos disponibles</p>
            </div>
          ) : (
          <Carousel 
            className="w-full px-8 md:px-0"
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem key={product._id || product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <div className="relative">
                    {product.image.startsWith('http') ? (
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <div className="absolute top-2 left-2 md:top-4 md:left-4">
                      <span className={`px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-semibold rounded-full ${
                        product.brand === 'Fester' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {product.brand}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                      <span className="text-[10px] md:text-sm text-muted-foreground">{product.category}</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 md:p-6">
                    <h3 className="mb-2 text-sm md:text-base">{product.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs md:text-sm h-8 md:h-9 px-2 md:px-3"
                        onClick={() => onProductClick?.(product._id || product.id || "")}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
          )}
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button size="lg" onClick={onViewAll}>
            Ver Todos los Productos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}