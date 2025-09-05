import react, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Grid, Popover, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

const COLORS = [
  '#FF0000',
  '#009900',
  '#0000FF',
  '#FF00FF',
  '#A52A2A',
  '#000080',
  '#800000',
  '#808000',
  '#800080',
  '#008080',
  '#FFA500',
  '#DFD030',
  '#3788D8',
];
const DEFAULT_COLOR = '#3788D8';

interface ColorPickerProps {
  fieldKey: string;
  fieldName: string;
  selectedColorProp?: string;
  onColorChange: (fieldKey: string, color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ fieldKey, fieldName, selectedColorProp, onColorChange }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedColor, setSelectedColor] = useState(selectedColorProp || DEFAULT_COLOR);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (selectedColorProp) {
      setSelectedColor(selectedColorProp);
    }
  }, [selectedColorProp]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(prev => (prev ? null : event.currentTarget));
  }, []);

  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedColor(color);
      onColorChange(fieldKey, color);
      setAnchorEl(null);
    },
    [fieldKey, onColorChange],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      <Button
        variant="outlined"
        onClick={handleClick}
        sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-start', border: '1px solid', borderColor: 'grey.400', pl: 0.7 }}
      >
        <CircleIcon sx={{ color: selectedColor, fontSize: 24, ml: 0 }} />
        <Typography variant="body1" sx={{ ml: 1, textTransform: 'none', color: 'grey' }}>
          {fieldName}
        </Typography>
      </Button>

      <Popover id={fieldKey} open={open} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 3 }}>
          <Grid container spacing={1} sx={{ width: 150 }}>
            {COLORS.map(color => (
              <Grid item xs={3} key={color}>
                <Button onClick={() => handleColorSelect(color)} sx={{ minWidth: 0, padding: 0, borderRadius: '50%', backgroundColor: color, width: 24, height: 24 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
    </Box>
  );
};

export default ColorPicker;