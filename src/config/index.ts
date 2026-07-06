import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });

const config = {
  port: process.env.PORT!,
  databaseUrl: process.env.DATABASE_URL!,
  appUrl: process.env.APP_URL!,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS!,

  jwt_access_secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET!,
  jwt_access_expiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION!,
  jwt_refresh_expiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION!,

  ssl_commerz_store_id: process.env.SSLCOMMERZ_STORE_ID!,
  ssl_commerz_store_pass: process.env.SSLCOMMERZ_STORE_PASSWORD!,
};

export default config;
