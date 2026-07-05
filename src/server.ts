import app from './app';

async function startServer() {
  try {
    app.listen(3000, () => {
      console.log('Server is running on port http://localhost:3000');
    });
  } catch (error: any) {
    console.log(`Error starting server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
