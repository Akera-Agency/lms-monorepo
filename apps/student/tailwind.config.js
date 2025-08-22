const sharedConfig = require('../../packages/ui/tailwind.config');

module.exports = {
  ...sharedConfig,
  content: [
    '../../packages/ui/components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,tsx,jsx}',
  ],
};
