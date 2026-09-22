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
import { getSupportPeople, getTicket, updateTicket } from "../api/tickets";
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
    return <CircularProgress />;
  }

  if (error || !ticket) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <Button variant="outlined" onClick={() => navigate("/")}>
          {t("tickets.backToList")}
        </Button>

        <Button variant="contained" onClick={() => setEditing(true)}>
          {t("tickets.edit")}
        </Button>
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

            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={saving}
            >
              {t("tickets.cancel")}
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
            {ticket.title}
          </Typography>

          <Typography sx={{ mb: 3 }}>{ticket.description}</Typography>

          <Typography>
            {t("tickets.status")}: {t(`tickets.statuses.${ticket.status}`)}
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
        </>
      )}
    </Paper>
  );
}

export default TicketDetails;
