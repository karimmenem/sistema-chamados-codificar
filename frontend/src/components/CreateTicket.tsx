import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import type { Priority, SupportPerson } from "../types/ticket";
import { createTicket, getSupportPeople } from "../api/tickets";

function CreateTicket() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");

  const [supportPeople, setSupportPeople] = useState<SupportPerson[]>([]);
  const [assignment, setAssignment] = useState("automatic");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadSupportPeople() {
      try {
        const data = await getSupportPeople();
        setSupportPeople(data);
      } catch (error) {
        console.error(error);
        setError(t("tickets.supportPeopleError"));
      }
    }

    loadSupportPeople();
  }, [t]);

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
        ...(assignment === "automatic"
          ? { automaticAssignment: true }
          : { assignedToId: Number(assignment) }),
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
    <Paper
      elevation={0}
      sx={{
        p: 4,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{ whiteSpace: "nowrap" }}
        >
          {t("tickets.backToList")}
        </Button>
      </Box>
      <Typography
        variant="h5"
        component="h1"
        sx={{
          mb: 3,
          fontWeight: 700,
        }}
      >
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

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          fullWidth
          select
          label={t("tickets.fields.priority")}
          value={priority}
          onChange={(event) => setPriority(event.target.value as Priority)}
        >
          <MenuItem value="LOW">{t("tickets.priorities.LOW")}</MenuItem>

          <MenuItem value="MEDIUM">{t("tickets.priorities.MEDIUM")}</MenuItem>

          <MenuItem value="HIGH">{t("tickets.priorities.HIGH")}</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          label={t("tickets.fields.responsible")}
          value={assignment}
          onChange={(event) => setAssignment(event.target.value)}
        >
          <MenuItem value="automatic">
            {t("tickets.assignment.automatic")}
          </MenuItem>

          {supportPeople.map((person) => (
            <MenuItem key={person.id} value={person.id}>
              {person.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{
            px: 3,
            py: 1.2,
            fontWeight: 600,
          }}
        >
          {submitting ? t("tickets.creating") : t("tickets.create")}
        </Button>
      </Box>
    </Paper>
  );
}

export default CreateTicket;
