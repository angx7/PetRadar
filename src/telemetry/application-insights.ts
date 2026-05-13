import { Logger } from '@nestjs/common';
import * as appInsights from 'applicationinsights';
import { envs } from '../config/envs';

const logger = new Logger('ApplicationInsights');

export function initializeApplicationInsights(): void {
  const setupString =
    envs.APPINSIGHTS_CONNECTION_STRING ||
    envs.APPLICATIONINSIGHTS_CONNECTION_STRING ||
    envs.APPINSIGHTS_INSTRUMENTATIONKEY;

  if (!setupString) {
    logger.warn('Application Insights is disabled: no connection string or instrumentation key configured.');
    return;
  }

  appInsights
    .setup(setupString)
    .setAutoCollectRequests(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectConsole(true, true)
    .start();

  logger.log('Application Insights telemetry enabled.');
}
