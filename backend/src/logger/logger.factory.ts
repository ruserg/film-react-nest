import { LoggerService } from '@nestjs/common';

import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export type LoggerType = 'console' | 'json' | 'tskv';

function resolveLoggerType(loggerType: string | undefined): LoggerType {
  const normalized = (loggerType ?? '').toLowerCase();
  if (normalized === 'json' || normalized === 'tskv') {
    return normalized;
  }
  return 'console';
}

/**
 * Выбор логгера: LOGGER_TYPE или LOGGER_FORMAT — console | json | tskv
 */
export function createLoggerByEnv(
  loggerType = process.env.LOGGER_TYPE ?? process.env.LOGGER_FORMAT,
): LoggerService {
  const resolved = resolveLoggerType(loggerType);

  switch (resolved) {
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
    default:
      return new DevLogger();
  }
}
