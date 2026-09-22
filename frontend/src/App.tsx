import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TicketList from "./components/TicketList";
import TicketDetails from "./components/TicketDetails";
import CreateTicket from "./components/CreateTicket";
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
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        <AppBar position="static" elevation={0}>
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
              <Link
                to="/"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {t("app.title")}
                </Typography>
              </Link>

              <Button
                variant="outlined"
                onClick={toggleLanguage}
                sx={{
                  color: "black",
                  borderColor: "rgba(5, 4, 4, 0.6)",
                  textTransform: "none",
                  borderRadius: 2,
                  minWidth: 100,
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                {i18n.language === "pt" ? "🇺🇸 English" : "🇧🇷 Português"}
              </Button>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<TicketList />} />
            <Route path="/tickets/new" element={<CreateTicket />} />
            <Route path="/tickets/:id" element={<TicketDetails />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  );
}

export default App;
