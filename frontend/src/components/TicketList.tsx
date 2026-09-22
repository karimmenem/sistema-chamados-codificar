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
          mb: 6,
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

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "rgba(139, 207, 63, 0.08)",
              }}
            >
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t("tickets.title")}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t("tickets.priority")}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t("tickets.status")}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t("tickets.responsible")}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t("tickets.created")}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {t("tickets.noResults")}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  hover
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.15s ease",
                    "&:hover": {
                      backgroundColor: "rgba(139, 207, 63, 0.06)",
                    },
                  }}
                >
                  <TableCell>{ticket.id}</TableCell>

                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {ticket.title}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 1.5 }}>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        backgroundColor:
                          ticket.priority === "HIGH"
                            ? "#ffebee"
                            : ticket.priority === "MEDIUM"
                              ? "#fff8e1"
                              : "#e8f5e9",
                        color:
                          ticket.priority === "HIGH"
                            ? "#c62828"
                            : ticket.priority === "MEDIUM"
                              ? "#f57f17"
                              : "#2e7d32",
                      }}
                    >
                      {t(`tickets.priorities.${ticket.priority}`)}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 1.5 }}>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        backgroundColor:
                          ticket.status === "OPEN"
                            ? "#e3f2fd"
                            : ticket.status === "IN_PROGRESS"
                              ? "#fff8e1"
                              : ticket.status === "RESOLVED"
                                ? "#e8f5e9"
                                : "#eeeeee",
                        color:
                          ticket.status === "OPEN"
                            ? "#1565c0"
                            : ticket.status === "IN_PROGRESS"
                              ? "#f57f17"
                              : ticket.status === "RESOLVED"
                                ? "#2e7d32"
                                : "#616161",
                      }}
                    >
                      {t(`tickets.statuses.${ticket.status}`)}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 1.5 }}>
                    {ticket.assignedTo.name}
                  </TableCell>

                  <TableCell sx={{ py: 1.5 }}>
                    {new Date(ticket.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default TicketList;
