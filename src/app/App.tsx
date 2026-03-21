import { BrowserRouter, useRoutes } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { ToastProvider } from "@/components/ui/toast";
import { appRoutes } from "./routes";

function AppRoutes() {
  return useRoutes(appRoutes);
}

export function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </QueryProvider>
  );
}
