import { useState } from "react";
import { Header } from "./components/layout/Header";
import { HeroSection } from "./components/sections/HeroSection";
import { AboutSection } from "./components/sections/AboutSection";
import { ProductCarousel } from "./components/sections/ProductCarousel";
import { WorkSection } from "./components/sections/WorkSection";
import { ContactSection } from "./components/sections/ContactSection";
import { AssistanceSection } from "./components/sections/AssistanceSection";
import { Footer } from "./components/layout/Footer";
import { ProductDetail } from "./components/details/ProductDetail";
import { ProjectDetail } from "./components/details/ProjectDetail";
import { ProductsPage } from "./components/pages/ProductsPage";
import { ProjectsPage } from "./components/pages/ProjectsPage";
import { Login } from "./components/auth/Login";
import { AdminPanel } from "./components/admin/AdminPanel";
import { FaviconHandler } from "./components/layout/FaviconHandler";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { Toaster } from "./components/ui/sonner";

type View = 
  | { type: "home" }
  | { type: "products" }
  | { type: "projects" }
  | { type: "product-detail"; productId: string }
  | { type: "project-detail"; projectId: string }
  | { type: "admin" };

function AppContent() {
  const [currentView, setCurrentView] = useState<View>({ type: "home" });
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const navigateTo = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    navigateTo({ type: "admin" });
  };

  const handleLogout = () => {
    logout();
    navigateTo({ type: "home" });
  };

  const goToHome = () => {
    navigateTo({ type: "home" });
  };

  const handleNavigateToSection = (sectionId: string) => {
    // Si no estamos en home, navegar a home primero
    if (currentView.type !== "home") {
      navigateTo({ type: "home" });
      // Esperar a que se cargue el home y luego hacer scroll
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Vista Home
  if (currentView.type === "home") {
    return (
      <>
        <FaviconHandler />
        <div className="min-h-screen flex flex-col">
          <Header 
            onLoginClick={handleLoginClick}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            onAdminClick={() => navigateTo({ type: "admin" })}
            onLogoClick={goToHome}
          />
          <main className="flex-1">
            <HeroSection />
            <AboutSection />
            <ProductCarousel 
              onViewAll={() => navigateTo({ type: "products" })}
              onProductClick={(productId) => navigateTo({ type: "product-detail", productId })}
            />
            <WorkSection 
              onViewAll={() => navigateTo({ type: "projects" })}
              onProjectClick={(projectId) => navigateTo({ type: "project-detail", projectId })}
            />
            <ContactSection />
            <AssistanceSection />
          </main>
          <Footer />
        </div>
        {showLogin && (
          <Login 
            onClose={() => setShowLogin(false)} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        <Toaster position="top-right" />
      </>
    );
  }

  // Vista de Productos
  if (currentView.type === "products") {
    return (
      <>
        <FaviconHandler />
        <div className="min-h-screen flex flex-col">
          <Header 
            onLoginClick={handleLoginClick}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            onAdminClick={() => navigateTo({ type: "admin" })}
            onLogoClick={goToHome}
            onNavigateToProducts={() => navigateTo({ type: "products" })}
            onNavigateToProjects={() => navigateTo({ type: "projects" })}
            onNavigateToSection={handleNavigateToSection}
          />
          <main className="flex-1">
            <ProductsPage 
              onBack={goToHome}
              onProductClick={(productId) => navigateTo({ type: "product-detail", productId })}
            />
          </main>
          <Footer />
        </div>
        {showLogin && (
          <Login 
            onClose={() => setShowLogin(false)} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        <Toaster position="top-right" />
      </>
    );
  }

  // Vista de Proyectos
  if (currentView.type === "projects") {
    return (
      <>
        <FaviconHandler />
        <div className="min-h-screen flex flex-col">
          <Header 
            onLoginClick={handleLoginClick}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            onAdminClick={() => navigateTo({ type: "admin" })}
            onLogoClick={goToHome}
            onNavigateToProducts={() => navigateTo({ type: "products" })}
            onNavigateToProjects={() => navigateTo({ type: "projects" })}
            onNavigateToSection={handleNavigateToSection}
          />
          <main className="flex-1">
            <ProjectsPage 
              onBack={goToHome}
              onProjectClick={(projectId) => navigateTo({ type: "project-detail", projectId })}
            />
          </main>
          <Footer />
        </div>
        {showLogin && (
          <Login 
            onClose={() => setShowLogin(false)} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        <Toaster position="top-right" />
      </>
    );
  }

  // Vista de Detalle de Producto
  if (currentView.type === "product-detail") {
    return (
      <>
        <FaviconHandler />
        <div className="min-h-screen flex flex-col">
          <Header 
            onLoginClick={handleLoginClick}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            onAdminClick={() => navigateTo({ type: "admin" })}
            onLogoClick={goToHome}
            onNavigateToProducts={() => navigateTo({ type: "products" })}
            onNavigateToProjects={() => navigateTo({ type: "projects" })}
            onNavigateToSection={handleNavigateToSection}
          />
          <main className="flex-1">
            <ProductDetail 
              productId={currentView.productId} 
              onBack={() => navigateTo({ type: "products" })} 
            />
          </main>
          <Footer />
        </div>
        {showLogin && (
          <Login 
            onClose={() => setShowLogin(false)} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        <Toaster position="top-right" />
      </>
    );
  }

  // Vista de Detalle de Proyecto
  if (currentView.type === "project-detail") {
    return (
      <>
        <FaviconHandler />
        <div className="min-h-screen flex flex-col">
          <Header 
            onLoginClick={handleLoginClick}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            onAdminClick={() => navigateTo({ type: "admin" })}
            onLogoClick={goToHome}
            onNavigateToProducts={() => navigateTo({ type: "products" })}
            onNavigateToProjects={() => navigateTo({ type: "projects" })}
            onNavigateToSection={handleNavigateToSection}
          />
          <main className="flex-1">
            <ProjectDetail 
              projectId={currentView.projectId} 
              onBack={() => navigateTo({ type: "projects" })} 
            />
          </main>
          <Footer />
        </div>
        {showLogin && (
          <Login 
            onClose={() => setShowLogin(false)} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        <Toaster position="top-right" />
      </>
    );
  }

  // Vista de Admin
  if (currentView.type === "admin") {
    if (!isAuthenticated) {
      navigateTo({ type: "home" });
      return null;
    }

    return (
      <>
        <FaviconHandler />
        <div className="min-h-screen flex flex-col">
          <Header 
            onLoginClick={handleLoginClick}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            onAdminClick={() => navigateTo({ type: "admin" })}
            disableLogoClick={true}
          />
          <main className="flex-1">
            <AdminPanel onBack={goToHome} />
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </>
    );
  }

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}