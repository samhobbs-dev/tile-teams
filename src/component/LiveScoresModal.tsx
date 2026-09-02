"use client";

import { Box, Button, CircularProgress, Modal, Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import LiveGameCard from "./LiveGameCard";
import useLiveScores from "../hook/useLiveScores";

const gameBoxSize = 100;

// Pop-up live scores screen if on mobile site
const LiveScoresModal: React.FC = () => {
  const { liveGames, loading } = useLiveScores();
  const [open, setOpen] = useState(false);
  function openModal() {
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
  }

  return (
    <div>
      {!loading && liveGames.length > 0 && (
        <Paper elevation={3} className="flex justify-center min-w-21.25">
          <Button
            onClick={openModal}
            sx={{ textTransform: "none", fontSize: 16, color: "text.primary" }}
          >
            View Live Scores
          </Button>
        </Paper>
      )}
      <Modal open={open} onClose={closeModal}>
        <Box
          alignItems="center"
          className="top-0 left-0 w-full h-full"
          sx={{ bgcolor: "background.default", color: "text.primary" }}
        >
          <CloseIcon fontSize="large" onClick={() => closeModal()} />
          <Stack alignItems="center">
            <Box className="h-6.25">
              <Typography>Live Scores</Typography>
            </Box>
            {loading ? (
              <CircularProgress />
            ) : (
              <Grid container justifyContent="center" spacing={1} padding={1}>
                {liveGames.map((game) => (
                  <Grid key={game.id}>
                    <LiveGameCard game={game} size={gameBoxSize} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default LiveScoresModal;
