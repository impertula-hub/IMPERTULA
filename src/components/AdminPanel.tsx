import { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ProductManagement } from "./admin/ProductManagement";
import { ProjectManagement } from "./admin/ProjectManagement";
import { ArrowLeft, Package, Briefcase } from "lucide-react";
import { motion } from "motion/react";

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="container mx-auto px-4 pt-28 pb-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona productos y proyectos del sitio</p>
          </div>
          <Button
            onClick={onBack}
            variant="default"
            className="gap-2 bg-[#EC1C24] hover:bg-[#B71C1C] shadow-lg"
            size="lg"
            disabled={isFormOpen}
          >
            <ArrowLeft className="h-5 w-5" />
            Volver al Sitio
          </Button>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Proyectos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <ProductManagement onFormStateChange={setIsFormOpen} />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <ProjectManagement onFormStateChange={setIsFormOpen} />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}