import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Users, 
  FileText, 
  Calculator, 
  Wrench, 
  Phone, 
  MessageCircle, 
  Calendar,
  CheckCircle,
  Clock,
  User
} from "lucide-react";
import { motion } from "motion/react";

const services = [
  {
    icon: Calculator,
    title: "Cálculo de Materiales",
    description: "Te ayudamos a calcular la cantidad exacta de productos necesarios para tu proyecto",
    color: "text-blue-600"
  },
  {
    icon: FileText,
    title: "Especificaciones Técnicas",
    description: "Proporcionamos documentación técnica detallada y fichas de seguridad",
    color: "text-green-600"
  },
  {
    icon: Wrench,
    title: "Asesoría en Aplicación",
    description: "Guía paso a paso para la correcta aplicación de nuestros productos",
    color: "text-purple-600"
  },
  {
    icon: Users,
    title: "Capacitación Técnica",
    description: "Cursos y talleres para profesionales de la construcción",
    color: "text-orange-600"
  }
];

const supportChannels = [
  {
    icon: Phone,
    title: "Especialista Principal",
    description: "Contacto directo con especialista",
    contact: "+52 1 773 133 5692",
    hours: "Lun-Vie 8:00-18:00",
    status: "Disponible",
    whatsapp: "5217731335692"
  },
  {
    icon: MessageCircle,
    title: "Soporte Técnico",
    description: "Asesoría técnica por WhatsApp",
    contact: "+52 1 773 124 6119",
    hours: "Lun-Vie 9:00-17:00",
    status: "En Línea",
    whatsapp: "5217731246119"
  },
  {
    icon: Calendar,
    title: "Visita Técnica",
    description: "Inspección y asesoría en sitio",
    contact: "Agenda tu cita",
    hours: "Por cita",
    status: "Programable",
    whatsapp: "5217731335692"
  }
];

const specialists = [
  {
    name: "Ing. Carlos Mendoza",
    specialty: "Impermeabilización Industrial",
    experience: "12 años",
    certifications: ["Fester Certified", "Henkel Expert"]
  },
  {
    name: "Arq. Ana Rodríguez",
    specialty: "Proyectos Residenciales",
    experience: "8 años",
    certifications: ["Especialista en Azoteas", "Fester Pro"]
  },
  {
    name: "Ing. Roberto Silva",
    specialty: "Aditivos para Concreto",
    experience: "15 años",
    certifications: ["Henkel Master", "Especialista Químico"]
  }
];

export function AssistanceSection() {
  return (
    <section id="asistencia" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">Asistencia Técnica Personalizada</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Nuestro equipo de especialistas está disponible para brindarte el soporte técnico 
            que necesitas en cada etapa de tu proyecto
          </p>
        </motion.div>
        
        {/* Servicios Técnicos */}
        <div className="mb-16">
          <motion.h3 
            className="text-2xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Servicios Técnicos
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardContent className="pt-6">
                    <service.icon className={`h-12 w-12 mx-auto mb-4 ${service.color}`} />
                    <h4 className="font-semibold mb-2">{service.title}</h4>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Canales de Soporte */}
        <div className="mb-16">
          <motion.h3 
            className="text-2xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Canales de Soporte
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <channel.icon className="h-8 w-8 text-primary" />
                    <Badge variant={
                      channel.status === 'Disponible' ? 'default' : 
                      channel.status === 'En Línea' ? 'secondary' : 'outline'
                    }>
                      {channel.status === 'Disponible' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {channel.status === 'En Línea' && <div className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse" />}
                      {channel.status === 'Programable' && <Clock className="h-3 w-3 mr-1" />}
                      {channel.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{channel.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{channel.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Contacto:</span>
                      <span className="text-primary">{channel.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Horario:</span>
                      <span>{channel.hours}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant={channel.status === 'En Línea' ? 'default' : 'outline'}
                    onClick={() => {
                      if ((channel as any).whatsapp) {
                        window.open(`https://wa.me/${(channel as any).whatsapp}`, '_blank');
                      }
                    }}
                  >
                    {channel.status === 'Programable' ? 'Agendar por WhatsApp' : 'Contactar por WhatsApp'}
                  </Button>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Especialistas */}
        <div className="mb-16">
          <motion.h3 
            className="text-2xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Nuestros Especialistas
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialists.map((specialist, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                    <h4 className="font-semibold">{specialist.name}</h4>
                    <p className="text-sm text-muted-foreground">{specialist.specialty}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Experiencia:</span>
                      <span>{specialist.experience}</span>
                    </div>
                    <div>
                      <span className="font-medium block mb-1">Certificaciones:</span>
                      <div className="flex flex-wrap gap-1">
                        {specialist.certifications.map((cert, certIndex) => (
                          <Badge key={certIndex} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    Consultar Especialista
                  </Button>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* CTA Final */}
        <motion.div 
          className="text-center bg-white rounded-lg p-8 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-2xl font-bold mb-4">¿Necesitas Asistencia Inmediata?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Nuestro equipo técnico está listo para ayudarte. No importa la complejidad de tu proyecto, 
            tenemos la experiencia y conocimiento para garantizar el éxito de tu aplicación.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.open('https://wa.me/5217731335692', '_blank')}
            >
              <Phone className="mr-2 h-5 w-5" />
              Llamar Ahora
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.open('https://wa.me/5217731246119', '_blank')}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}