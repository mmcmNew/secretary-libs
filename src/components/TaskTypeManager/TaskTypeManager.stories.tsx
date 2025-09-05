import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { TaskTypeManager } from './TaskTypeManager';
import type { TaskType, TaskGroup } from '../../types';

const meta = {
  title: 'Example/TaskTypeManager',
  component: TaskTypeManager,
  tags: ['autodocs'],
} satisfies Meta<typeof TaskTypeManager>;

export default meta;
type Story = StoryObj<typeof meta>;

const initialGroups: TaskGroup[] = [
  { id: 1, name: 'Работа', order: 0, color: '#ffc107' },
  { id: 2, name: 'Личное', order: 1, color: '#4caf50' },
];

const initialTypes: TaskType[] = [
  { id: 101, name: 'Созвон', color: '#f44336', group_id: 1, order: 0 },
  { id: 102, name: 'Отчет', color: '#2196f3', group_id: 1, order: 1 },
  { id: 103, name: 'Спорт', color: '#9c27b0', group_id: 2, order: 0 },
  { id: 104, name: 'Без группы', color: '#795548', group_id: null, order: 0 },
];

const Template: React.FC = () => {
  const [groups, setGroups] = useState<TaskGroup[]>(initialGroups);
  const [types, setTypes] = useState<TaskType[]>(initialTypes);
  const [loading, setLoading] = useState(false);

  const handleOrderChange = async ({ groups: newGroups, types: newTypes }) => {
    action('onOrderChange')({ newGroups, newTypes });
    setLoading(true);
    // Имитация задержки API
    setTimeout(() => {
      setGroups(newGroups);
      setTypes(newTypes);
      setLoading(false);
    }, 500);
  };

  return (
    <TaskTypeManager
      taskGroups={groups}
      taskTypes={types}
      isLoading={loading}
      onTypeCreate={async (data) => {
        action('onTypeCreate')(data);
        setTypes(prev => [...prev, { ...data, id: Date.now(), order: prev.length }]);
      }}
      onTypeUpdate={async (id, data) => {
        action('onTypeUpdate')(id, data);
        setTypes(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
      }}
      onTypeDelete={async (id) => {
        action('onTypeDelete')(id);
        if (window.confirm('Удалить?')) {
          setTypes(prev => prev.filter(t => t.id !== id));
        }
      }}
      onOrderChange={handleOrderChange}
    />
  );
};

export const Default: Story = {
  render: () => <Template />,
};