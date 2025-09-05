import React, { useState } from "react";
import { Box, Button, Grid, Popover, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

interface ColorPickerProps {
  id?: string;
  label?: string;
  colors?: string[];
  value?: string;
  defaultColor?: string;
  onChange?: (color: string) => void;
}

const DEFAULT_COLORS = [
  "#FF0000", "#009900", "#0000FF", "#FF00FF",
  "#A52A2A", "#000080", "#800000", "#808000",
  "#800080", "#008080", "#FFA500", "#DFD030", "#3788D8",
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  id,
  label = "Color",
  colors = DEFAULT_COLORS,
  value,
  defaultColor = "#3788D8",
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const selectedColor = value || defaultColor;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleColorSelect = (color: string) => {
    onChange?.(color);
    setAnchorEl(null);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Button
        id={id}
        variant="outlined"
        onClick={handleClick}
        sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "flex-start", border: "1px solid", borderColor: "grey.400", pl: 0.7 }}
      >
        <CircleIcon sx={{ color: selectedColor, fontSize: 24 }} />
        <Typography variant="body1" sx={{ ml: 1, textTransform: "none", color: "grey" }}>
          {label}
        </Typography>
      </Button>

      <Popover open={open} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Box sx={{ p: 1, bgcolor: "background.paper", borderRadius: 1, boxShadow: 3 }}>
          <Grid container spacing={1} sx={{ width: 150 }} role="grid">
            {colors.map((color) => (
              <Grid xs={3} key={color} role="gridcell">
                <Button
                  onClick={() => handleColorSelect(color)}
                  aria-label={`Select color ${color}`}
                  sx={{ minWidth: 0, p: 0, borderRadius: "50%", backgroundColor: color, width: 24, height: 24 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
    </Box>
  );
};

export default ColorPicker;
