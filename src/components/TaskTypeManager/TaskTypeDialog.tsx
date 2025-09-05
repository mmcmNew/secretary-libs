import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { TaskTypeFormData, TaskGroup } from '../../types';

export interface TaskTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  data: TaskTypeFormData;
  onChange: (field: keyof TaskTypeFormData, value: string | number | null) => void;
  title: string;
  groups: TaskGroup[];
  text: {
    labelName: string;
    labelDescription: string;
    labelColor: string;
    labelGroup: string;
    groupNone: string;
    buttonCancel: string;
    buttonSave: string;
  };
}

const TaskTypeDialog: React.FC<TaskTypeDialogProps> = ({
  open,
  onClose,
  onSave,
  data,
  onChange,
  title,
  groups,
  text,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            autoFocus
            label={text.labelName}
            type="text"
            fullWidth
            variant="standard"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            required
          />
          <TextField
            label={text.labelDescription}
            type="text"
            fullWidth
            variant="standard"
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            multiline
            rows={3}
          />
          <FormControl fullWidth variant="standard">
            <InputLabel id="group-select-label">{text.labelGroup}</InputLabel>
            <Select
              labelId="group-select-label"
              value={data.group_id === null ? '' : data.group_id}
              onChange={(e) => onChange('group_id', e.target.value === '' ? null : Number(e.target.value))}
              label={text.labelGroup}
            >
              <MenuItem value="">
                <em>{text.groupNone}</em>
              </MenuItem>
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <label htmlFor="color-picker">{text.labelColor}:</label>
            <TextField
              id="color-picker"
              type="color"
              value={data.color}
              onChange={(e) => onChange('color', e.target.value)}
              variant="standard"
              sx={{
                width: 50,
                height: 30,
                p: '2px',
                border: 'none',
                '& .MuiInputBase-input': { p: 0, height: '100%', cursor: 'pointer' },
                '& input[type="color"]::-webkit-color-swatch-wrapper': {
                  padding: 0,
                },
                '& input[type="color"]::-webkit-color-swatch': {
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{text.buttonCancel}</Button>
        <Button onClick={onSave}>{text.buttonSave}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskTypeDialog;