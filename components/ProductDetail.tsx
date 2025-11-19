import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Star, Package, Shield, Droplets, Clock, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { productApi, Product } from "../lib/api";

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

export function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await productApi.getById(productId);
      setProduct(data || null);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Producto no encontrado</h2>
          <Button onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

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
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Productos
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Imagen del producto */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="overflow-hidden">
              {product.image && typeof product.image === 'string' && product.image.startsWith('http') ? (
                <ImageWithFallback
                  src={product.image}
                  alt={product.name || 'Producto'}
                  className="w-full h-96 object-cover"
                />
              ) : product.image && typeof product.image === 'string' ? (
                <img
                  src={product.image}
                  alt={product.name || 'Producto'}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </Card>
          </motion.div>

          {/* Información principal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                {product.brand && (
                  <Badge className={
                    product.brand === 'Fester' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                  }>
                    {product.brand}
                  </Badge>
                )}
                {product.category && (
                  <Badge variant="outline">{product.category}</Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{product.name || 'Producto'}</h1>
              
              {product.rating && (
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < product.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-muted-foreground">
                    ({product.rating}.0)
                  </span>
                </div>
              )}

              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.fullDescription || product.description || 'Sin descripción disponible'}
              </p>
            </div>

            {product.specifications && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Especificaciones Técnicas
                  </h3>
                  <div className="space-y-3">
                    {product.specifications.presentation && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Presentación:</span>
                        <span className="font-medium">{product.specifications.presentation}</span>
                      </div>
                    )}
                    {product.specifications.coverage && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Rendimiento:</span>
                        <span className="font-medium">{product.specifications.coverage}</span>
                      </div>
                    )}
                    {product.specifications.dryingTime && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Tiempo de secado:</span>
                        <span className="font-medium">{product.specifications.dryingTime}</span>
                      </div>
                    )}
                    {product.specifications.colors && (
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Colores:</span>
                        <span className="font-medium">{product.specifications.colors}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button size="lg" className="flex-1">
                Solicitar Cotización
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                Ficha Técnica
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Características y aplicaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {product.features && Array.isArray(product.features) && product.features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Características Principales
                  </h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {product.applications && Array.isArray(product.applications) && product.applications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    Aplicaciones Recomendadas
                  </h3>
                  <ul className="space-y-3">
                    {product.applications.map((application, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{application}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white p-3 rounded-lg">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">¿Necesitas asesoría técnica?</h3>
                  <p className="text-muted-foreground mb-4">
                    Nuestro equipo de expertos está disponible para ayudarte a elegir el producto adecuado 
                    y resolver cualquier duda técnica sobre la aplicación.
                  </p>
                  <Button>Contactar a un Especialista</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
