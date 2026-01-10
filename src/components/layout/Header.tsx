import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Menu, Mail, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import impertulaLogo from "figma:asset/a0ed4645e2c2d04e7dcad407574a9720f8232052.png";

interface HeaderProps {
  onLogoClick?: () => void;
  onLoginClick?: () => void;
  onAdminClick?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  onNavigateToProducts?: () => void;
  onNavigateToProjects?: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  disableLogoClick?: boolean; // Nueva prop para deshabilitar el click en el logo
}

export function Header({ onLogoClick, onLoginClick, onAdminClick, onLogout, isAuthenticated, onNavigateToProducts, onNavigateToProjects, onNavigateToSection, disableLogoClick }: HeaderProps) {
  const { user, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled_percent = (window.scrollY / windowHeight) * 100;
      setScrollProgress(scrolled_percent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    
    // Primero intentar navegar a la sección si existe en el DOM
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else if (onNavigateToSection) {
      // Si no existe, usar el callback para navegar
      onNavigateToSection(sectionId);
    }
  };

  const handleProductsClick = () => {
    setIsMobileMenuOpen(false);
    if (onNavigateToProducts) {
      onNavigateToProducts();
    } else {
      scrollToSection("productos");
    }
  };

  const handleProjectsClick = () => {
    setIsMobileMenuOpen(false);
    if (onNavigateToProjects) {
      onNavigateToProjects();
    } else {
      scrollToSection("trabajos");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      {/* Barra de progreso de scroll */}
      <div className="h-1 bg-gradient-to-r from-[#EC1C24] to-[#B71C1C]" style={{ width: `${scrollProgress}%` }} />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={disableLogoClick ? undefined : onLogoClick} 
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <img
              src={impertulaLogo}
              alt="IMPERTULA"
              className="h-12 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-2xl tracking-tight group-hover:text-[#EC1C24] transition-colors">
                IMPERTULA
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Soluciones en Impermeabilización
              </span>
            </div>
          </button>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("inicio")}
              className="hover:text-[#EC1C24] transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection("nosotros")}
              className="hover:text-[#EC1C24] transition-colors"
            >
              Nosotros
            </button>
            <button
              onClick={handleProductsClick}
              className="hover:text-[#EC1C24] transition-colors"
            >
              Productos
            </button>
            <button
              onClick={handleProjectsClick}
              className="hover:text-[#EC1C24] transition-colors"
            >
              Trabajos
            </button>
            <button
              onClick={() => scrollToSection("contacto")}
              className="hover:text-[#EC1C24] transition-colors"
            >
              Contacto
            </button>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Button
                    onClick={onAdminClick}
                    variant="outline"
                    className="gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Button>
                )}
                <Button
                  onClick={onLogout}
                  variant="outline"
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button
                onClick={onLoginClick}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <User className="h-4 w-4" />
                Iniciar Sesión
              </Button>
            )}
          </nav>

          {/* Botón Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Menú Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-left hover:text-[#EC1C24] transition-colors"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("nosotros")}
                className="text-left hover:text-[#EC1C24] transition-colors"
              >
                Nosotros
              </button>
              <button
                onClick={handleProductsClick}
                className="text-left hover:text-[#EC1C24] transition-colors"
              >
                Productos
              </button>
              <button
                onClick={handleProjectsClick}
                className="text-left hover:text-[#EC1C24] transition-colors"
              >
                Trabajos
              </button>
              <button
                onClick={() => scrollToSection("contacto")}
                className="text-left hover:text-[#EC1C24] transition-colors"
              >
                Contacto
              </button>

              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Button
                      onClick={() => {
                        onAdminClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="gap-2 justify-start"
                    >
                      <Shield className="h-4 w-4" />
                      Admin
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      onLogout?.();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="gap-2 justify-start"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    onLoginClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 gap-2 justify-start"
                >
                  <User className="h-4 w-4" />
                  Iniciar Sesión
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}