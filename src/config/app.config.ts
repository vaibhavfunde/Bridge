
export default () => ({

  port: parseInt(process.env.PORT, 10) || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/shortener',
  jwtSecret: process.env. || 'secret123',

});
