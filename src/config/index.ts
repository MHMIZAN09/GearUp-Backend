import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });

const config = {
  port: process.env.PORT!,
  databaseUrl: process.env.DATABASE_URL!,
  frontendUrl: process.env.FRONTEND_URL!,
  backendUrl: process.env.BACKEND_URL!,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS!,

  jwt_access_secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET!,
  jwt_access_expiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION!,
  jwt_refresh_expiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION!,

  supper_admin_email: process.env.SUPPER_ADMIN_EMAIL!,
  supper_admin_password: process.env.SUPPER_ADMIN_PASSWORD!,
  supper_admin_name: process.env.SUPPER_ADMIN_NAME!,

  ssl_commerz_store_id: process.env.SSLCOMMERZ_STORE_ID!,
  ssl_commerz_store_pass: process.env.SSLCOMMERZ_STORE_PASSWORD!,
  google_client_id: process.env.GOOGLE_CLIENT_ID!,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY!,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!,
  redis_host: process.env.REDIS_HOST!,
  redis_port: process.env.REDIS_PORT!,
  redis_user: process.env.REDIS_USER!,
  redis_password: process.env.REDIS_PASSWORD!,
  smtp_user: process.env.SMTP_USER!,
  smtp_password: process.env.SMTP_PASSWORD!,
};

export default config;
