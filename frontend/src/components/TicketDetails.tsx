import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  CircularProgress,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  deleteTicket,
  getSupportPeople,
  getTicket,
  updateTicket,
} from "../api/tickets";
import type { SupportPerson, Ticket } from "../types/ticket";

function TicketDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [editing, setEditing] = useState(false);
  const [supportPeople, setSupportPeople] = useState<SupportPerson[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Ticket["priority"]>("MEDIUM");
  const [status, setStatus] = useState<Ticket["status"]>("OPEN");
  const [assignedToId, setAssignedToId] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
        setTitle(data.title);
        setDescription(data.description);
        setPriority(data.priority);
        setStatus(data.status);
        setAssignedToId(data.assignedToId);
        const people = await getSupportPeople();
        setSupportPeople(people);
      } catch (error) {
        console.error(error);
        setError(t("tickets.loadingError"));
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [id, t]);

  async function handleSave() {
    if (!ticket) return;

    try {
      setSaving(true);
      setError("");

      const updatedTicket = await updateTicket(ticket.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        assignedToId,
      });

      setTicket(updatedTicket);
      setEditing(false);
    } catch (error) {
      console.error(error);
      setError(t("tickets.updateError"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!ticket) return;

    const confirmed = window.confirm(t("tickets.deleteConfirmation"));

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteTicket(ticket.id);

      navigate("/");
    } catch (error) {
      console.error(error);
      setError(t("tickets.deleteError"));
    } finally {
      setDeleting(false);
    }
  }

  function handleCancel() {
    if (!ticket) return;

    setTitle(ticket.title);
    setDescription(ticket.description);
    setPriority(ticket.priority);
    setStatus(ticket.status);
    setAssignedToId(ticket.assignedToId);
    setEditing(false);
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !ticket) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{
            alignSelf: { xs: "flex-start", sm: "auto" },
            whiteSpace: "nowrap",
          }}
        >
          {t("tickets.backToList")}
        </Button>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            variant="contained"
            onClick={() => setEditing(true)}
            disabled={deleting}
            sx={{ flex: { xs: 1, sm: "initial" } }}
          >
            {t("tickets.edit")}
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
            sx={{ flex: { xs: 1, sm: "initial" } }}
          >
            {deleting ? t("tickets.deleting") : t("tickets.delete")}
          </Button>
        </Box>
      </Box>

      {editing ? (
        <Box>
          <TextField
            fullWidth
            label={t("tickets.fields.title")}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            minRows={4}
            label={t("tickets.fields.description")}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            select
            label={t("tickets.fields.priority")}
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as Ticket["priority"])
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="LOW">{t("tickets.priorities.LOW")}</MenuItem>
            <MenuItem value="MEDIUM">{t("tickets.priorities.MEDIUM")}</MenuItem>
            <MenuItem value="HIGH">{t("tickets.priorities.HIGH")}</MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label={t("tickets.status")}
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as Ticket["status"])
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="OPEN">{t("tickets.statuses.OPEN")}</MenuItem>
            <MenuItem value="IN_PROGRESS">
              {t("tickets.statuses.IN_PROGRESS")}
            </MenuItem>
            <MenuItem value="RESOLVED">
              {t("tickets.statuses.RESOLVED")}
            </MenuItem>
            <MenuItem value="CLOSED">{t("tickets.statuses.CLOSED")}</MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label={t("tickets.fields.responsible")}
            value={assignedToId}
            onChange={(event) => setAssignedToId(Number(event.target.value))}
            sx={{ mb: 3 }}
          >
            {supportPeople.map((person) => (
              <MenuItem key={person.id} value={person.id}>
                {person.name}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? t("tickets.saving") : t("tickets.save")}
            </Button>

            <Button variant="outlined" onClick={handleCancel} disabled={saving}>
              {t("tickets.cancel")}
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
            }}
          >
            {ticket.title}
          </Typography>

          <Box
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: "grey.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {t("tickets.fields.description")}
            </Typography>

            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {ticket.description}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5 }}
              >
                {t("tickets.status")}
              </Typography>

              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 1,
                  fontSize: "0.9rem",
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
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5 }}
              >
                {t("tickets.priority")}
              </Typography>

              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 1,
                  fontSize: "0.9rem",
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
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5 }}
              >
                {t("tickets.responsible")}
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {ticket.assignedTo.name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.5 }}
            >
              {t("tickets.created")}
            </Typography>

            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {new Date(ticket.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}

export default TicketDetails;
