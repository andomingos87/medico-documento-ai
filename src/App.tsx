
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { DocumentsList } from "./pages/DocumentsList";
import { CreateDocument } from "./pages/CreateDocument";
import { ViewDocument } from "./pages/ViewDocument";
import { Signatures } from "./pages/Signatures";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Rotas protegidas dentro do layout */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documentos" element={<DocumentsList />} />
              <Route path="/documentos/:id" element={<ViewDocument />} />
              <Route path="/criar-documento" element={<CreateDocument />} />
              <Route path="/configuracoes" element={<Settings />} />
            </Route>

            {/* Redirect da página inicial para o dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
