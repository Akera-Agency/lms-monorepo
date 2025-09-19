const sharedConfig = require('../ui/tailwind.config');

module.exports = {
  ...sharedConfig,
  content: [
    '../ui/src/components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primaryOrange: 'hsl(var(--primaryOrange))',
      },
    },
  },
};
