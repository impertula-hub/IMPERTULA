import { Separator } from "./ui/separator";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información de la Empresa */}
          <div>
            <h3 className="text-white font-bold text-xl mb-4">IMPERTULA</h3>
            <p className="mb-4 text-sm leading-relaxed">
              Especialistas en impermeabilización con más de 15 años de experiencia. 
              Distribuidores autorizados de las marcas Fester y Henkel.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61578373134388" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visita nuestra página de Facebook"
              >
                <Facebook className="h-5 w-5 hover:text-blue-400 cursor-pointer transition-colors" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visita nuestro Instagram"
              >
                <Instagram className="h-5 w-5 hover:text-pink-400 cursor-pointer transition-colors" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visita nuestro LinkedIn"
              >
                <Linkedin className="h-5 w-5 hover:text-blue-500 cursor-pointer transition-colors" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visita nuestro canal de YouTube"
              >
                <Youtube className="h-5 w-5 hover:text-red-500 cursor-pointer transition-colors" />
              </a>
            </div>
          </div>
          
          {/* Enlaces Rápidos */}
          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#nosotros" className="hover:text-white transition-colors">Nosotros</a></li>
              <li><a href="#productos" className="hover:text-white transition-colors">Productos</a></li>
              <li><a href="#trabajos" className="hover:text-white transition-colors">Trabajos</a></li>
              <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#asistencia" className="hover:text-white transition-colors">Asistencia</a></li>
            </ul>
          </div>
          
          {/* Productos */}
          <div>
            <h4 className="text-white font-semibold mb-4">Nuestros Productos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Impermeabilizantes Fester</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Aditivos Henkel</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Selladores</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Primers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Membranas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Acelerantes</a></li>
            </ul>
          </div>
          
          {/* Información de Contacto */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Fester Tula<br />Tula de Allende, Hidalgo</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+52 1 773 133 5692</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Impertula@hotmail.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Lun-Vie: 8:00-18:00<br />Sáb: 9:00-14:00</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-700" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2024 IMPERTULA. Todos los derechos reservados.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-white transition-colors">Aviso Legal</a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-xs">
          <p>
            Distribuidor autorizado de <span className="font-semibold text-blue-400">FESTER</span> y <span className="font-semibold text-green-400">HENKEL</span>
          </p>
          <p className="mt-1 text-gray-500">
            Las marcas Fester y Henkel son propiedad de sus respectivos fabricantes
          </p>
        </div>
      </div>
    </footer>
  );
}