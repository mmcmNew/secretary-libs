import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import ColorPicker from '../ColorPicker/ColorPicker.jsx'; // Предполагается, что этот компонент также будет переведен на TS

// Этот тип можно вынести в общий файл типов (например, src/types.ts)
export interface TaskGroupFormData {
  name: string;
  description: string;
  color: string;
}

interface TaskTypeGroupDialogProps {
  open: boolean;
  onClose: () => void;
  data: TaskGroupFormData;
  onChange: (field: keyof TaskGroupFormData, value: string) => void;
  onSave: (data: TaskGroupFormData) => void;
  title?: string;
}

const TaskTypeGroupDialog: React.FC<TaskTypeGroupDialogProps> = ({
  open,
  onClose,
  data,
  onChange,
  onSave,
  title = 'Создать группу типов',
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {title}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Название" value={data.name} onChange={(e) => onChange('name', e.target.value)} required />
          {/* Предполагается, что ColorPicker адаптирован под эту сигнатуру onChange */}
          <ColorPicker fieldKey="color" fieldName="Цвет" selectedColorProp={data.color} onColorChange={(_, c) => onChange('color', c)} />
          <TextField label="Описание" value={data.description} onChange={(e) => onChange('description', e.target.value)} multiline rows={3} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onSave(data)}>Сохранить</Button>
        <Button onClick={onClose}>Отмена</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskTypeGroupDialog;
