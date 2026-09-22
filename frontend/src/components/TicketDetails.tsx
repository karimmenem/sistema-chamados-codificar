import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  CircularProgress,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { getTicket } from "../api/tickets";
import type { Ticket } from "../types/ticket";

function TicketDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTicket() {
      try {
        if (!id) {
          throw new Error("Ticket ID is missing.");
        }

        const data = await getTicket(Number(id));
        setTicket(data);
      } catch (error) {
        console.error(error);
        setError(t("tickets.loadingError"));
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [id, t]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !ticket) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    
    <Paper sx={{ p: 3 }}>
      <Button
        variant="outlined"
        onClick={() => navigate("/")}
        sx={{ mb: 2 }}
      >
        {t("tickets.backToList")}
      </Button>

      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        {ticket.title}
      </Typography>

      <Typography sx={{ mb: 3 }}>
        {ticket.description}
      </Typography>

      <Typography>
        {t("tickets.status")}:{" "}
        {t(`tickets.statuses.${ticket.status}`)}
      </Typography>

      <Typography>
        {t("tickets.priority")}:{" "}
        {t(`tickets.priorities.${ticket.priority}`)}
      </Typography>

      <Typography>
        {t("tickets.responsible")}: {ticket.assignedTo.name}
      </Typography>

      <Typography sx={{ mt: 1 }}>
        {t("tickets.created")}:{" "}
        {new Date(ticket.createdAt).toLocaleString()}
      </Typography>
    </Paper>
  );
}

export default TicketDetails;