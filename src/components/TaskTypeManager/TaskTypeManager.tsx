import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Box, Button, Card, CardContent, CircularProgress, IconButton, List, ListItem, Typography } from '@mui/material';
import type { DropResult, DroppableProvided } from '@hello-pangea/dnd';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import TaskTypeDialog from './TaskTypeDialog.tsx';
import type { TaskType, TaskGroup, TaskTypeFormData } from '../../types';
import TaskTypeGroupDialog from './TaskTypeGroupDialog';
type GroupedTypes = Record<string, TaskType[]>;

export interface TaskTypeManagerProps {
  taskTypes: TaskType[];
  taskGroups: TaskGroup[];
  isLoading?: boolean;
  onTypeCreate: (data: TaskTypeFormData) => Promise<void>;
  onTypeUpdate: (id: TaskType['id'], data: TaskTypeFormData) => Promise<void>;
  onTypeDelete: (id: TaskType['id']) => Promise<void>;
  onGroupCreate?: (data: any) => Promise<void>;
  onGroupUpdate?: (id: TaskGroup['id'], data: any) => Promise<void>;
  onGroupDelete?: (id: TaskGroup['id']) => Promise<void>;
  onOrderChange: (args: {
    groups: TaskGroup[];
    types: TaskType[];
  }) => Promise<void>;
  text?: {
    managerTitle: string;
    createButton: string;
    ungroupedTitle: string;
    confirmDelete: string;
    // Dialog texts
    dialogTitleCreate: string;
    dialogTitleEdit: string;
    dialogLabelName: string;
    dialogLabelDescription: string;
    dialogLabelColor: string;
    dialogLabelGroup: string;
    dialogGroupNone: string;
    dialogButtonCancel: string;
    dialogButtonSave: string;
  };
}

const DEFAULT_FORM_DATA: TaskTypeFormData = { name: '', color: '#3788D8', description: '', group_id: null };

const DEFAULT_TEXT = {
  managerTitle: 'Типы задач',
  createButton: 'Создать тип',
  ungroupedTitle: 'Без группы',
  confirmDelete: 'Удалить тип задачи?',
  dialogTitleCreate: 'Создать тип',
  dialogTitleEdit: 'Редактировать тип',
  dialogLabelName: 'Название',
  dialogLabelDescription: 'Описание',
  dialogLabelColor: 'Цвет',
  dialogLabelGroup: 'Группа',
  dialogGroupNone: 'Нет',
  dialogButtonCancel: 'Отмена',
  dialogButtonSave: 'Сохранить',
};

export const TaskTypeManager: React.FC<TaskTypeManagerProps> = ({
  taskTypes,
  taskGroups,
  isLoading = false,
  onTypeCreate,
  onTypeUpdate,
  onTypeDelete,
  onOrderChange,
  text: textProps,
}) => {
  const text = { ...DEFAULT_TEXT, ...textProps };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<TaskType | null>(null);
  const [formData, setFormData] = useState<TaskTypeFormData>(DEFAULT_FORM_DATA);

  const updateFormData = (field: keyof TaskTypeFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const { sortedGroups, typesByGroup } = useMemo(() => {
    const sorted = [...taskGroups].sort((a, b) => a.order - b.order);

    const byGroup: GroupedTypes = taskTypes.reduce((acc, type) => {
      const groupId = type.group_id ?? 'null';
      if (!acc[groupId]) {
        acc[groupId] = [];
      }
      acc[groupId].push(type);
      return acc;
    }, {} as GroupedTypes);

    for (const key in byGroup) {
      byGroup[key].sort((a, b) => a.order - b.order);
    }

    return { sortedGroups: sorted, typesByGroup: byGroup };
  }, [taskTypes, taskGroups]);

  const handleCreate = () => {
    setEditingType(null);
    setFormData(DEFAULT_FORM_DATA);
    setDialogOpen(true);
  };

  const handleEdit = (type: TaskType) => {
    setEditingType(type);
    setFormData({
      name: type.name || '',
      color: type.color || '#3788D8',
      description: type.description || '',
      group_id: type.group_id || null,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: TaskType['id']) => {
    if (window.confirm(text.confirmDelete)) {
      await onTypeDelete(id);
    }
  };

  const handleSave = async () => {
    try {
      if (editingType) {
        await onTypeUpdate(editingType.id, formData);
      } else {
        await onTypeCreate(formData);
      }
      setDialogOpen(false);
    } catch (err) {
      console.error('Failed to save task type', err);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'group') {
      const newGroups = Array.from(sortedGroups);
      const [moved] = newGroups.splice(source.index, 1);
      newGroups.splice(destination.index, 0, moved);
      const updatedGroups = newGroups.map((g, idx) => ({ ...g, order: idx }));
      await onOrderChange({ groups: updatedGroups, types: taskTypes });
    } else {
      // type === 'type'
      const sourceGroupId = source.droppableId;
      const destGroupId = destination.droppableId;
      const currentTypes = [...taskTypes];

      if (sourceGroupId === destGroupId) {
        // Reordering within the same group
        const groupKey = sourceGroupId === 'null' ? null : Number(sourceGroupId);
        const itemsInGroup = currentTypes
          .filter((t) => t.group_id === groupKey)
          .sort((a, b) => a.order - b.order);

        const [movedItem] = itemsInGroup.splice(source.index, 1);
        itemsInGroup.splice(destination.index, 0, movedItem);

        const updatedItems = itemsInGroup.map((item, index) => ({ ...item, order: index }));

        const newTypes = currentTypes.filter((t) => t.group_id !== groupKey).concat(updatedItems);

        await onOrderChange({ groups: taskGroups, types: newTypes });
      } else {
        // Moving between different groups
        const sourceGroupKey = sourceGroupId === 'null' ? null : Number(sourceGroupId);
        const destGroupKey = destGroupId === 'null' ? null : Number(destGroupId);

        const sourceItems = currentTypes
          .filter((t) => t.group_id === sourceGroupKey)
          .sort((a, b) => a.order - b.order);

        const [movedItem] = sourceItems.splice(source.index, 1);

        const destItems = currentTypes.filter((t) => t.group_id === destGroupKey).sort((a, b) => a.order - b.order);

        destItems.splice(destination.index, 0, { ...movedItem, group_id: destGroupKey });

        const updatedSourceItems = sourceItems.map((item, index) => ({ ...item, order: index }));
        const updatedDestItems = destItems.map((item, index) => ({ ...item, order: index }));

        const otherItems = currentTypes.filter((t) => t.group_id !== sourceGroupKey && t.group_id !== destGroupKey);

        const newTypes = [...otherItems, ...updatedSourceItems, ...updatedDestItems];
        await onOrderChange({ groups: taskGroups, types: newTypes });
      }
    }
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">{text.managerTitle}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          {text.createButton}
        </Button>
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="groups" type="group">
          {(prov) => (
            <div ref={prov.innerRef} {...prov.droppableProps}>
              {sortedGroups.map((g, idx) => (
                <Draggable draggableId={`group-${g.id}`} index={idx} key={g.id}>
                  {(p) => (
                    <div ref={p.innerRef} {...p.draggableProps}>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton {...p.dragHandleProps} size="small" sx={{ cursor: 'grab' }}>
                            <DragIndicatorIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="h6" sx={{ backgroundColor: g.color || '#eee', p: 1, flex: 1 }}>
                            {g.name}
                          </Typography>
                        </Box>
                        <Droppable droppableId={String(g.id)} type="type">
                          {(pr) => <TypeList droppableProvided={pr} types={typesByGroup[g.id] || []} onEdit={handleEdit} onDelete={handleDelete} />}
                        </Droppable>
                      </Box>
                    </div>
                  )}
                </Draggable>
              ))}
              {prov.placeholder}
            </div>
          )}
        </Droppable>
        <Typography variant="h6" sx={{ mt: 2 }}>{text.ungroupedTitle}</Typography>
        <Droppable droppableId="null" type="type">
          {(pr) => <TypeList droppableProvided={pr} types={typesByGroup['null'] || []} onEdit={handleEdit} onDelete={handleDelete} />}
        </Droppable>
      </DragDropContext>
      <TaskTypeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        data={formData}
        onChange={updateFormData}
        onSave={handleSave}
        title={editingType ? text.dialogTitleEdit : text.dialogTitleCreate}
        groups={sortedGroups}
        text={{
          labelName: text.dialogLabelName,
          labelDescription: text.dialogLabelDescription,
          labelColor: text.dialogLabelColor,
          labelGroup: text.dialogLabelGroup,
          groupNone: text.dialogGroupNone,
          buttonCancel: text.dialogButtonCancel,
          buttonSave: text.dialogButtonSave,
        }}
      />
    </Box>
  );
};

const TypeList: React.FC<{
  droppableProvided: DroppableProvided;
  types: TaskType[];
  onEdit: (type: TaskType) => void;
  onDelete: (id: TaskType['id']) => void;
}> = ({ droppableProvided, types, onEdit, onDelete }) => (
  <List {...droppableProvided.droppableProps} ref={droppableProvided.innerRef}>
    {types.map((t, i) => (
      <Draggable key={t.id} draggableId={`type-${t.id}`} index={i}>
        {(pp) => (
          <ListItem ref={pp.innerRef} {...pp.draggableProps} sx={{ p: 0, mb: 1 }}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton {...pp.dragHandleProps} size="small" sx={{ cursor: 'grab' }}><DragIndicatorIcon fontSize="small" /></IconButton>
                    <Box sx={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: t.color }} />
                    <Typography variant="body1">{t.name}</Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => onEdit(t)}><EditIcon /></IconButton>
                    <IconButton onClick={() => onDelete(t.id)}><DeleteIcon /></IconButton>
                  </Box>
                </Box>
                {t.description && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{t.description}</Typography>}
              </CardContent>
            </Card>
          </ListItem>
        )}
      </Draggable>
    ))}
    {droppableProvided.placeholder}
  </List>
);

export default TaskTypeManager;
