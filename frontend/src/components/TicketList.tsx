import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getTickets } from "../api/tickets";
import type { Ticket } from "../types/ticket";

function TicketList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        console.error(error);
        setError(t("tickets.loadingError"));
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, [t]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        {t("tickets.title")}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t("tickets.title")}</TableCell>
              <TableCell>{t("tickets.priority")}</TableCell>
              <TableCell>{t("tickets.status")}</TableCell>
              <TableCell>{t("tickets.responsible")}</TableCell>
              <TableCell>{t("tickets.created")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                hover
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{ticket.id}</TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {ticket.title}
                  </Typography>
                </TableCell>

                <TableCell>
                  {t(`tickets.priorities.${ticket.priority}`)}
                </TableCell>

                <TableCell>
                  {t(`tickets.statuses.${ticket.status}`)}
                </TableCell>

                <TableCell>{ticket.assignedTo.name}</TableCell>

                <TableCell>
                  {new Date(ticket.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default TicketList;