const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const app = require('./app');

dotenv.config();

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`✅ Server Running on Port ${PORT}`);
  });

  // Handle errors
  server.on('error', (err) => {
    console.error('❌ Server Error:', err);
  });

  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
  });
};

startServer();