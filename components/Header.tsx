import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, Mail, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import impertulaLogo from "figma:asset/a0ed4645e2c2d04e7dcad407574a9720f8232052.png";

interface HeaderProps {
  onLogoClick?: () => void;
  onLoginClick?: () => void;
  onAdminClick?: () => void;
  onLogout?: () => void;
}

export function Header({ onLogoClick, onLoginClick, onAdminClick, onLogout }: HeaderProps) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      
      // Calcular progreso del scroll
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled_percent = (window.scrollY / windowHeight) * 100;
      setScrollProgress(scrolled_percent);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Llamar inmediatamente para establecer el estado inicial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      const headerOffset = 80; // altura del header sticky (h-20)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false); // Cerrar menú móvil al navegar
    }
  };

  return (
    <header 
      className={`shadow-sm sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white' : 'bg-[#003366]'
      }`}
    >
      {/* Barra de progreso - estilo rodillo pintando */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 transition-all duration-150 ease-out"
          style={{ 
            width: `${scrollProgress}%`,
            boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)'
          }}
        >
          {/* Efecto de rodillo */}
          <div 
            className="absolute right-0 top-0 h-full w-8 bg-gradient-to-r from-transparent to-orange-600"
            style={{
              filter: 'blur(2px)',
              transform: 'skewX(-10deg)'
            }}
          />
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-6">
            <img 
              src={impertulaLogo}
              alt="IMPERTULA Logo"
              className="h-12 md:h-14 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onLogoClick}
            />
            {/* Distribuidor autorizado - visible en móvil al lado del logo */}
            <div className={`flex md:hidden items-center space-x-0.5 text-xs transition-colors ${
              isScrolled ? 'text-muted-foreground' : 'text-white/90'
            }`}>
              <span className={`font-semibold ${isScrolled ? 'text-primary' : 'text-white'}`}>FESTER</span>
              <span>&</span>
              <span className={`font-semibold ${isScrolled ? 'text-primary' : 'text-white'}`}>HENKEL</span>
            </div>
            {/* Distribuidor autorizado - versión completa para desktop */}
            <div className={`hidden lg:flex items-center space-x-1 text-base transition-colors ${
              isScrolled ? 'text-muted-foreground' : 'text-white/90'
            }`}>
              <span>Distribuidor autorizado</span>
              <span className={`font-semibold ${isScrolled ? 'text-primary' : 'text-white'}`}>FESTER</span>
              <span>&</span>
              <span className={`font-semibold ${isScrolled ? 'text-primary' : 'text-white'}`}>HENKEL</span>
            </div>
            {/* Distribuidor autorizado - versión compacta para tablet */}
            <div className={`hidden md:flex lg:hidden items-center space-x-0.5 text-sm transition-colors ${
              isScrolled ? 'text-muted-foreground' : 'text-white/90'
            }`}>
              <span className={`font-semibold ${isScrolled ? 'text-primary' : 'text-white'}`}>FESTER</span>
              <span>&</span>
              <span className={`font-semibold ${isScrolled ? 'text-primary' : 'text-white'}`}>HENKEL</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a 
              href="#inicio" 
              onClick={(e) => smoothScrollTo(e, '#inicio')}
              className={`transition-colors ${
                isScrolled 
                  ? 'text-foreground hover:text-primary' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              Inicio
            </a>
            <a 
              href="#nosotros" 
              onClick={(e) => smoothScrollTo(e, '#nosotros')}
              className={`transition-colors ${
                isScrolled 
                  ? 'text-foreground hover:text-primary' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              Nosotros
            </a>
            <a 
              href="#productos" 
              onClick={(e) => smoothScrollTo(e, '#productos')}
              className={`transition-colors ${
                isScrolled 
                  ? 'text-foreground hover:text-primary' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              Productos
            </a>
            <a 
              href="#trabajos" 
              onClick={(e) => smoothScrollTo(e, '#trabajos')}
              className={`transition-colors ${
                isScrolled 
                  ? 'text-foreground hover:text-primary' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              Trabajos
            </a>
            <a 
              href="#contacto" 
              onClick={(e) => smoothScrollTo(e, '#contacto')}
              className={`transition-colors ${
                isScrolled 
                  ? 'text-foreground hover:text-primary' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              Contacto
            </a>
            <a 
              href="#asistencia" 
              onClick={(e) => smoothScrollTo(e, '#asistencia')}
              className={`transition-colors ${
                isScrolled 
                  ? 'text-foreground hover:text-primary' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              Asistencia
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className={`hidden md:flex items-center space-x-1 text-sm transition-colors ${
              isScrolled ? 'text-foreground' : 'text-white'
            }`}>
              <Mail className="h-4 w-4" />
              <span>Impertula@hotmail.com</span>
            </div>
            
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <span className={`text-sm hidden md:inline ${
                  isScrolled ? 'text-muted-foreground' : 'text-white/90'
                }`}>
                  {user?.name}
                </span>
                {isAdmin && onAdminClick && (
                  <Button 
                    variant={isScrolled ? "outline" : "secondary"}
                    size="sm"
                    onClick={onAdminClick}
                    className={`gap-1 ${!isScrolled ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' : ''}`}
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden md:inline">Admin</span>
                  </Button>
                )}
                <Button 
                  variant={isScrolled ? "outline" : "secondary"}
                  size="sm"
                  onClick={onLogout}
                  className={`gap-1 ${!isScrolled ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' : ''}`}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Salir</span>
                </Button>
              </div>
            )}
            
            <Button 
              variant={isScrolled ? "outline" : "secondary"}
              size="sm" 
              className={`lg:hidden ${!isScrolled ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white shadow-lg z-50">
          {/* Badge Distribuidor Autorizado en móvil */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 py-2 px-4 text-center border-b">
            <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
              <span>Distribuidor autorizado</span>
              <span className="font-semibold text-primary">FESTER</span>
              <span>&</span>
              <span className="font-semibold text-green-600">HENKEL</span>
            </div>
          </div>
          <nav className="flex flex-col items-center space-y-4 p-4">
            <a 
              href="#inicio" 
              onClick={(e) => smoothScrollTo(e, '#inicio')}
              className="transition-colors text-foreground hover:text-primary"
            >
              Inicio
            </a>
            <a 
              href="#nosotros" 
              onClick={(e) => smoothScrollTo(e, '#nosotros')}
              className="transition-colors text-foreground hover:text-primary"
            >
              Nosotros
            </a>
            <a 
              href="#productos" 
              onClick={(e) => smoothScrollTo(e, '#productos')}
              className="transition-colors text-foreground hover:text-primary"
            >
              Productos
            </a>
            <a 
              href="#trabajos" 
              onClick={(e) => smoothScrollTo(e, '#trabajos')}
              className="transition-colors text-foreground hover:text-primary"
            >
              Trabajos
            </a>
            <a 
              href="#contacto" 
              onClick={(e) => smoothScrollTo(e, '#contacto')}
              className="transition-colors text-foreground hover:text-primary"
            >
              Contacto
            </a>
            <a 
              href="#asistencia" 
              onClick={(e) => smoothScrollTo(e, '#asistencia')}
              className="transition-colors text-foreground hover:text-primary"
            >
              Asistencia
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}