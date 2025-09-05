// import React from 'react';
import type { Meta, StoryObj, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Box } from '@mui/material';

import ColorPicker from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  decorators: [
    (Story: StoryFn) => (
      <Box sx={{ width: 200 }}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onColorChange: { action: 'colorChanged' },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  args: {
    fieldKey: 'taskColor',
    fieldName: 'Цвет задачи',
    onColorChange: action('onColorChange'),
  },
};

export const WithPreselectedColor: Story = {
  args: {
    ...Default.args,
    selectedColorProp: '#FF00FF', // Magenta
  },
};