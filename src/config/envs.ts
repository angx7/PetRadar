import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').default('3000').asPortNumber(),
  DB_HOST: env.get('DB_HOST').default('localhost').asString(),
  DB_PORT: env.get('DB_PORT').default('5432').asPortNumber(),
  DB_USER: env.get('DB_USER').default('postgres').asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').default('postgres').asString(),
  DB_NAME: env.get('DB_NAME').default('petradar').asString(),
  MAILER_EMAIL: env.get('MAILER_EMAIL').default('').asString(),
  MAILER_PASSWORD: env.get('MAILER_PASSWORD').default('').asString(),
  MAILER_SERVICE: env.get('MAILER_SERVICE').default('').asString(),
  MAPBOX_TOKEN: env.get('MAPBOX_TOKEN').default('').asString(),
  ALERT_EMAIL: env.get('ALERT_EMAIL').default('').asString(),
};
