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
  TextField,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import { getTickets } from "../api/tickets";
import type { Ticket } from "../types/ticket";

function TicketList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
    Ticket["priority"] | "ALL"
  >("ALL");
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

  const filteredTickets = tickets.filter((ticket) => {
    const searchTerm = search.toLowerCase();

    const title = ticket.title.toLowerCase();
    const priority = ticket.priority.toLowerCase();
    const translatedPriority = t(
      `tickets.priorities.${ticket.priority}`,
    ).toLowerCase();
    const responsible = ticket.assignedTo.name.toLowerCase();

    const matchesSearch =
      title.includes(searchTerm) ||
      priority.includes(searchTerm) ||
      translatedPriority.includes(searchTerm) ||
      responsible.includes(searchTerm);

    const matchesPriority =
      priorityFilter === "ALL" || ticket.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2">
          {t("tickets.title")}
        </Typography>

        <Button variant="contained" onClick={() => navigate("/tickets/new")}>
          {t("tickets.create")}
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label={t("tickets.search")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <TextField
          select
          label={t("tickets.filterPriority")}
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(event.target.value as Ticket["priority"] | "ALL")
          }
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="ALL">{t("tickets.all")}</MenuItem>
          <MenuItem value="LOW">{t("tickets.priorities.LOW")}</MenuItem>
          <MenuItem value="MEDIUM">{t("tickets.priorities.MEDIUM")}</MenuItem>
          <MenuItem value="HIGH">{t("tickets.priorities.HIGH")}</MenuItem>
        </TextField>
      </Box>

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
            {filteredTickets.map((ticket) => (
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

                <TableCell>{t(`tickets.statuses.${ticket.status}`)}</TableCell>

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
