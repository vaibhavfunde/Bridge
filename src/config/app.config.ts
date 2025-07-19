// src/config/app.config.ts
export default () => ({
  appName: process.env.APP_NAME,
  appVersion: process.env.APP_VERSION,
  appDescription: process.env.APP_DESCRIPTION,

});
