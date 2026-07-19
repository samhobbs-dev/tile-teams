"use client";
 
import {
  Box,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUseCurrentLogo } from "../store/currentLogoSlice";
import RankingsModal from "./RankingsModal";
import useWindowSize from "../hook/useWindowSize";
import { CURRENT_YEAR, FIRST_YEAR, desktopWidth } from "../const/const";
import { SelectChangeEvent } from "@mui/material";

interface MyProps {
  defaultYear: number;
  onChange: (year: number) => void;
  incrementYear: () => void;
  decrementYear: () => void;
}

const arrowWidth = 40;

// Bar atop ConfGrid allowing changing year through arrows or drop down menu
const ConfYear: React.FC<MyProps> = ({
  defaultYear,
  onChange,
  incrementYear,
  decrementYear,
}) => {
  const useCurrentLogo = useAppSelector(
    (state) => state.currentLogo.useCurrentLogo
  );
  const windowSize = useWindowSize();
  const isDesktopWidth = windowSize.width >= desktopWidth;
  const isFirstYear = defaultYear === FIRST_YEAR;
  const isCurrentYear = defaultYear === CURRENT_YEAR;

  const dispatch = useAppDispatch();
  const year = defaultYear;
  const years = Array.from(
    { length: CURRENT_YEAR - FIRST_YEAR + 1 },
    (value, index) => index + FIRST_YEAR
  );
  function handleChange(event: SelectChangeEvent<number>) {
    onChange(Number(event.target.value));
  }
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      width="90vw"
      zIndex="1"
      position="sticky"
      top="0"
    >
      {/* If on mobile site, option to pull up AP rankings menu */}
      <Box width="20%">
        {!isDesktopWidth && <RankingsModal year={year} />}
      </Box>
      <Stack direction="row" justifyContent="center" width="60%">
        {/* Move back a year (doesn't appear if it's the first year)*/}
        <Box display="flex" width={arrowWidth}>
          {!isFirstYear && (
            <IconButton onClick={decrementYear}>
              <ArrowLeftIcon />
            </IconButton>
          )}
        </Box>
        {/* Change year via drop-down menu */}
        <Paper elevation={5}>
          <Select value={year} onChange={handleChange} sx={{ border: "none" }}>
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </Paper>
        {/* Move forward a year (doesn't appear if it's the current year) */}
        <Box display="flex" width={arrowWidth}>
          {!isCurrentYear && (
            <IconButton onClick={incrementYear}>
              <ArrowRightIcon />
            </IconButton>
          )}
        </Box>
      </Stack>
      {/* Trigger if current logos or year logos should be displayed */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        width="20%"
      >
        <Paper elevation={3}>
          <Stack direction="row" alignItems="center" padding={1} spacing={1}>
            <Typography>Current Logos</Typography>
            <Switch
              checked={useCurrentLogo}
              onChange={() => dispatch(setUseCurrentLogo())}
            />
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
};

export default ConfYear;
