"use client";
 
import { Box, Button, Modal, Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import TeamLogo from "./TeamLogo";
import RankingService from "../api/rankingService";
import Ranking from "../type/ranking";

interface MyProps {
  year: number;
}

const height = 70;
const width = 130;
const logoHeight = 50;

// Pop-up rankings screen if on mobile site
const RankingsModal: React.FC<MyProps> = ({ year }) => {
  const [rankings, setRankings] = useState<Ranking[]>([]);

  useEffect(() => {
    RankingService.getFinalAPRankingsByYear(year).then((response) => {
      setRankings(response as Ranking[]);
    });
  }, [year]);

  const [open, setOpen] = useState(false);
  function openModal() {
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
  }

  return (
    <div>
      {rankings.length > 0 && (
        <Paper elevation={3} className="flex justify-center min-w-21.25">
          <Button
            onClick={openModal}
            sx={{ color: "text.primary", textTransform: "none", fontSize: 16 }}
          >
            View AP Rankings
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
            <Box className="h-6.25" style={{ width: width + 30 }}>
              <Typography>Final AP Rankings</Typography>
            </Box>
            <Grid container justifyContent="center" direction="row">
              {rankings.map((r) => (
                <Grid key={r.id}>
                  <Stack
                    justifyContent="center"
                    direction="row"
                    style={{ height, width }}
                  >
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      padding={1}
                      width={width}
                    >
                      <Grid size={3}>
                        <Typography>#{r.ranking}</Typography>
                      </Grid>
                      <Grid size={9}>
                        <Stack
                          alignItems="center"
                          alignContent="center"
                          justifyContent="center"
                        >
                          <TeamLogo
                            teamId={r.teamId}
                            maxHeight={logoHeight}                            
                            fontSize={14}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default RankingsModal;
