// Storybook — the designer instrument layer (dev-tooling; Vite builder matching the app).
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: { name: '@storybook/react-vite', options: {} },
  stories: ['../src/design/stories/**/*.stories.@(ts|tsx)'],
  addons: [],
};

export default config;
