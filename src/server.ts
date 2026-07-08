import app from './app';
import config from './config';

async function startServer() {
  try {
    app.listen(config.port, () => {
      console.log(`Server is running on port http://localhost:${config.port}`);
    });
  } catch (error: any) {
    console.log(`Error starting server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
