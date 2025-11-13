import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { ProductCarousel } from "./components/ProductCarousel";
import { WorkSection } from "./components/WorkSection";
import { ContactSection } from "./components/ContactSection";
import { AssistanceSection } from "./components/AssistanceSection";
import { Footer } from "./components/Footer";
import { ProductDetail } from "./components/ProductDetail";
import { ProjectDetail } from "./components/ProjectDetail";
import { ProductsPage } from "./components/ProductsPage";
import { ProjectsPage } from "./components/ProjectsPage";
import { Login } from "./components/Login";
import { AdminPanel } from "./components/AdminPanel";
import { FaviconHandler } from "./components/FaviconHandler";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "./components/ui/sonner";
import workImage1 from "figma:asset/fa650a6a0a18dba261a5cee34d00a7146e2a0b4f.png";
import workImage2 from "figma:asset/d0e23da5a30072fe88b0db84b52cea260b878bc6.png";
import workImage3 from "figma:asset/2264f64b61e205723c7629af47513d9f5d16d709.png";
import cfeRoofImage from "figma:asset/aeb1d84d9aee52d03e808aedad395a193003542b.png";
import industrialWorkImage from "figma:asset/a52275f45d573bf57d26bfc9847afc77771e9298.png";
import clientLogos1 from "figma:asset/73dc067b94aee1592966f2298412ef89e11e0e17.png";
import clientLogos2 from "figma:asset/9727e1a5ff5f50da585351b0312a8953dfcdd69a.png";
import clientLogos3 from "figma:asset/931f698b4be72bae95d35c906a02a010b7350ced.png";

type View = "home" | "products" | "projects" | "product-detail" | "project-detail" | "admin";

function AppContent() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();

  // Manejar la ruta /login desde la URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/login') {
      setShowLogin(true);
      // Limpiar la URL sin recargar la página
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Proteger la vista de admin
  useEffect(() => {
    if (currentView === "admin" && !isAuthenticated) {
      setCurrentView("home");
    }
  }, [isAuthenticated, currentView]);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView("product-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView("project-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedProductId(null);
    setSelectedProjectId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminClick = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    setCurrentView("admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewAllProducts = () => {
    setCurrentView("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewAllProjects = () => {
    setCurrentView("projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <FaviconHandler />
      <Header 
        onLogoClick={handleBackToHome}
        onLoginClick={() => setShowLogin(true)}
        onAdminClick={handleAdminClick}
        onLogout={handleLogout}
      />
      
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleAdminClick}
        />
      )}
      <AnimatePresence mode="wait">
        {currentView === "home" && (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <HeroSection />
            <AboutSection />
            <ProductCarousel 
              onProductClick={handleProductClick} 
              onViewAll={handleViewAllProducts}
            />
            <WorkSection 
              onProjectClick={handleProjectClick}
              onViewAll={handleViewAllProjects}
            />
            <ContactSection />
            <AssistanceSection />
          </motion.main>
        )}
        
        {currentView === "products" && (
          <motion.main
            key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ProductsPage 
              onBack={handleBackToHome}
              onProductClick={handleProductClick}
            />
          </motion.main>
        )}
        
        {currentView === "projects" && (
          <motion.main
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ProjectsPage 
              onBack={handleBackToHome}
              onProjectClick={handleProjectClick}
            />
          </motion.main>
        )}
        
        {currentView === "product-detail" && selectedProductId && (
          <motion.main
            key="product-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ProductDetail 
              productId={selectedProductId} 
              onBack={handleBackToHome} 
            />
          </motion.main>
        )}
        
        {currentView === "project-detail" && selectedProjectId && (
          <motion.main
            key="project-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ProjectDetail 
              projectId={selectedProjectId} 
              onBack={handleBackToHome} 
            />
          </motion.main>
        )}
        
        {currentView === "admin" && (
          <motion.main
            key="admin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <AdminPanel onBack={handleBackToHome} />
          </motion.main>
        )}
      </AnimatePresence>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}