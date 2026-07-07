// Storybook preview — the app's stylesheet + a dark canvas matching the scenes.
import type { Preview } from '@storybook/react';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    backgrounds: { default: 'engine', values: [{ name: 'engine', value: '#0c0a09' }] },
    layout: 'fullscreen',
  },
};

export default preview;
