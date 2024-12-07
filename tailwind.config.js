module.exports = {
  content: [
      "./src/**/*.{js,jsx}",
      "./src/**/edit.js",
      "./src/**/save.js",
      "./build/**/*.php",
      "./src/**/*.css",
  ],
  safelist: process.env.NODE_ENV === 'development' ? [
    {
      pattern: /./, // This matches all classes in development
    },
  ] : [],
  theme: {
      extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  corePlugins: {
    preflight: false,
  },
  daisyui: {
    themes: ['cupcake'],
  },
};
