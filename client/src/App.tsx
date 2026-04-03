import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { IssuesProvider } from "./contexts/IssuesContext";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/feed" component={Feed} />
      <Route path="/404" component={NotFound} />
      <Route path="" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <IssuesProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </IssuesProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
