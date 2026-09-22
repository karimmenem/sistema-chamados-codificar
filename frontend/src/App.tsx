import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TicketList from "./components/TicketList";
import TicketDetails from "./components/TicketDetails";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

function App() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(newLanguage);
  };

  return (
    <BrowserRouter>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <AppBar position="static">
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
              <Typography variant="h6" component="div">
                {t("app.title")}
              </Typography>

              <Button
                color="inherit"
                onClick={toggleLanguage}
                sx={{ textTransform: "none" }}
              >
                {i18n.language === "pt" ? "English" : "Português"}
              </Button>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<TicketList />} />
            <Route path="/tickets/:id" element={<TicketDetails />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  );
}

export default App;