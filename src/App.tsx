import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Templates from "./pages/Templates";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard\" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="calculadora" element={<Calculator />} />
              <Route path="projetos" element={<Projects />} />
              <Route path="projetos/:id" element={<ProjectDetails />} />
              <Route path="templates" element={<Templates />} />
              <Route path="relatorios" element={<Reports />} />
              <Route path="configuracoes" element={<Settings />} />
              <Route path="perfil" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster 
          richColors 
          position="top-right" 
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--card-foreground))',
            },
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;