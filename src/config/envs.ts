import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').default('3000').asPortNumber(),
  DB_HOST: env.get('DB_HOST').default('localhost').asString(),
  DB_PORT: env.get('DB_PORT').default('5432').asPortNumber(),
  DB_USER: env.get('DB_USER').default('postgres').asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').default('postgres').asString(),
  DB_NAME: env.get('DB_NAME').default('petradar').asString(),
  REDIS_HOST: env.get('REDIS_HOST').default('localhost').asString(),
  REDIS_PORT: env.get('REDIS_PORT').default('6379').asPortNumber(),
  REDIS_URL: env.get('REDIS_URL').default('redis://localhost:6379').asString(),
  REDIS_TTL_SECONDS: env.get('REDIS_TTL_SECONDS').default('60').asIntPositive(),
  REDIS_ENABLED: env.get('REDIS_ENABLED').default('true').asBool(),
  APPINSIGHTS_CONNECTION_STRING: env.get('APPINSIGHTS_CONNECTION_STRING').default('').asString(),
  APPLICATIONINSIGHTS_CONNECTION_STRING: env
    .get('APPLICATIONINSIGHTS_CONNECTION_STRING')
    .default('')
    .asString(),
  APPINSIGHTS_INSTRUMENTATIONKEY: env.get('APPINSIGHTS_INSTRUMENTATIONKEY').default('').asString(),
  MAILER_EMAIL: env.get('MAILER_EMAIL').default('').asString(),
  MAILER_PASSWORD: env.get('MAILER_PASSWORD').default('').asString(),
  MAILER_SERVICE: env.get('MAILER_SERVICE').default('').asString(),
  MAPBOX_TOKEN: env.get('MAPBOX_TOKEN').default('').asString(),
  ALERT_EMAIL: env.get('ALERT_EMAIL').default('').asString(),
};
