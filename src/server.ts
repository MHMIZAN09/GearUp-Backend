import app from './app';
import config from './config';
import { transporter } from './lib/nodemailer';
import { prisma } from './lib/prisma';
import { redisClient } from './lib/redis';
import { seedSuperAdmin } from './script/admin-create';

async function startServer() {
  try {
    await prisma.$connect();
		console.log("Connected to the database successfully.");

		await redisClient.connect();
		console.log("Redis Connected Successfully.");

		await transporter.verify();
		console.log("Nodemailer Connected Successfully.");
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
