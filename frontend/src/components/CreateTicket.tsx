import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { Priority } from "../types/ticket";
import { createTicket } from "../api/tickets";

function CreateTicket() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);


  async function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      setError(t("tickets.validation.required"));
      return;
    }

    try {
      setError("");
      setSubmitting(true);

      await createTicket({
        title: title.trim(),
        description: description.trim(),
        priority,
        automaticAssignment: true,
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      setError(t("tickets.createError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        {t("tickets.createTitle")}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
        onChange={(event) => setPriority(event.target.value as Priority)}
        sx={{ mb: 3 }}
      >
        <MenuItem value="LOW">
          {t("tickets.priorities.LOW")}
        </MenuItem>

        <MenuItem value="MEDIUM">
          {t("tickets.priorities.MEDIUM")}
        </MenuItem>

        <MenuItem value="HIGH">
          {t("tickets.priorities.HIGH")}
        </MenuItem>
      </TextField>

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? t("tickets.creating") : t("tickets.create")}
      </Button>
    </Paper>
  );
}

export default CreateTicket;