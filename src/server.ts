import app from './app';
import config from './config';
import { seedSuperAdmin } from './script/admin-create';

async function startServer() {
  try {
    await seedSuperAdmin(); // Seed the super admin user before starting the server
    app.listen(config.port, () => {
      console.log(`Server is running on port http://localhost:${config.port}`);
    });
  } catch (error: any) {
    console.log(`Error starting server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
