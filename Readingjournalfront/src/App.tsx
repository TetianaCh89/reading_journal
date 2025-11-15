import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { Button } from "@mui/material";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!sessionStorage.getItem("jwt");
  });

  useEffect(() => {
    const handler = () => setIsAuthenticated(!!sessionStorage.getItem("jwt"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleLogin = (token: string) => {
    sessionStorage.setItem("jwt", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            📚 Reading Journal
          </Typography>
              <Button 
                color="inherit" 
                onClick={handleLogout} 
              >
                Log out
              </Button>
        </Toolbar>
      </AppBar>

      {!isAuthenticated ? (
        <Box
          sx={{
            width: "100vw",
            height: "calc(100vh - 64px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#f5f5f5",
            p: 2,
          }}
        >
          <Container
            maxWidth="xs"
            sx={{
              bgcolor: "white",
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Login onLogin={handleLogin} />
          </Container>
        </Box>
      ) : (
        <Dashboard />
      )}
    </QueryClientProvider>
  );
}

export default App;
