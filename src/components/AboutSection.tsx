import { Card, CardContent } from "./ui/card";
import { Shield, Users, Award, Settings, LucideIcon } from "lucide-react";
import impertulaBuildingImage from "figma:asset/b070b976acd62b3e563da7aed3e9b4f26177de0f.png";
import { motion } from "motion/react";
import { useState } from "react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  delay: number;
}

function ServiceCard({ icon: Icon, title, description, color, delay }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const colorMap = {
    blue: { bg: "from-blue-500/10 to-blue-600/20", icon: "text-blue-600" },
    green: { bg: "from-green-500/10 to-green-600/20", icon: "text-green-600" },
    purple: { bg: "from-purple-500/10 to-purple-600/20", icon: "text-purple-600" },
    orange: { bg: "from-orange-500/10 to-orange-600/20", icon: "text-orange-600" }
  };
  
  const colors = colorMap[color as keyof typeof colorMap];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={isHovered ? { scale: 1.05, y: -5 } : { scale: 1, y: 0 }}
    >
      <Card className="text-center p-6 relative overflow-hidden group cursor-pointer">
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <CardContent className="pt-6 relative z-10">
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className={`h-12 w-12 ${colors.icon} mx-auto mb-4`} />
          </motion.div>
          <h4 className="font-semibold mb-2">{title}</h4>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AboutSection() {
  return (
    <section id="nosotros" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Quiénes Somos
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Somos <strong>IMPERTULA</strong>, una empresa especializada en impermeabilización y distribución 
              de aditivos para la construcción. Con más de 15 años de experiencia en el mercado, 
              nos hemos consolidado como distribuidores autorizados de las prestigiosas marcas 
              <strong className="text-primary"> Fester</strong> y <strong className="text-primary">Henkel</strong>.
            </p>
            <p className="text-muted-foreground mb-8">
              Nuestra misión es ofrecer soluciones integrales de impermeabilización que garanticen 
              la durabilidad y protección de las construcciones, brindando productos de la más alta 
              calidad y un servicio técnico especializado.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Calidad Garantizada</h4>
                  <p className="text-sm text-muted-foreground">Productos certificados</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <h4 className="font-semibold">Equipo Experto</h4>
                  <p className="text-sm text-muted-foreground">Profesionales capacitados</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src={impertulaBuildingImage}
              alt="Local de IMPERTULA - Distribuidor autorizado Fester"
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
          </motion.div>
        </div>
        
        <div className="mt-16">
          <motion.h3 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            Qué Hacemos
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              icon={Shield}
              title="Impermeabilización"
              description="Soluciones completas para techos, azoteas, muros y cimentaciones"
              color="blue"
              delay={0.1}
            />
            
            <ServiceCard
              icon={Settings}
              title="Aditivos"
              description="Productos especializados para mejorar las propiedades del concreto"
              color="green"
              delay={0.2}
            />
            
            <ServiceCard
              icon={Users}
              title="Asesoría Técnica"
              description="Consultoría especializada y soporte técnico personalizado"
              color="purple"
              delay={0.3}
            />
            
            <ServiceCard
              icon={Award}
              title="Distribución"
              description="Distribuidores oficiales de las marcas Fester y Henkel"
              color="orange"
              delay={0.4}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
