
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
import { ViewDocument } from "./pages/ViewDocument";
import { EditDocument } from "./pages/EditDocument";
import { Signatures } from "./pages/Signatures";
import { Settings } from "./pages/Settings";
import { Procedures } from "./pages/Procedures";
import { Anamneses } from "./pages/Anamneses";
import { Patients } from "./pages/Patients";
import { Professionals } from "./pages/Professionals";
import { Tasks } from "./pages/Tasks";
import { Register } from "./pages/Register";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Profile } from "./pages/Profile";
import { Appointments } from "./pages/Appointments";
import PatientAnamnesis from "./pages/PatientAnamnesis";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Página pública para pacientes preencherem anamnese */}
              <Route path="/anamnese" element={<PatientAnamnesis />} />
              {/* Rotas protegidas dentro do layout */}
              <Route element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/documentos" element={<DocumentsList />} />
                <Route path="/documentos/:id" element={<ViewDocument />} />
                <Route path="/documentos/:id/editar" element={<EditDocument />} />
                <Route path="/criar-documento" element={<Navigate to="/documentos" replace />} />
                <Route path="/assinaturas" element={<Signatures />} />
                <Route path="/pacientes" element={<Patients />} />
                <Route path="/procedimentos" element={<Procedures />} />
                <Route path="/tarefas" element={<Tasks />} />
                <Route path="/profissionais" element={<Professionals />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/anamneses" element={<Anamneses />} />
                <Route path="/agendamentos" element={<Appointments />} />
                <Route path="/configuracoes" element={<Settings />} />
              </Route>
              {/* Página inicial com redirecionamento inteligente */}
              <Route path="/" element={<Index />} />
              {/* Página 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
