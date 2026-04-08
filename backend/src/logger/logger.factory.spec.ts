import { JsonLogger } from './json.logger';
import { DevLogger } from './dev.logger';
import { TskvLogger } from './tskv.logger';
import { createLoggerByEnv } from './logger.factory';

describe('createLoggerByEnv', () => {
  const originalType = process.env.LOGGER_TYPE;
  const originalFormat = process.env.LOGGER_FORMAT;

  afterEach(() => {
    if (originalType === undefined) {
      delete process.env.LOGGER_TYPE;
    } else {
      process.env.LOGGER_TYPE = originalType;
    }
    if (originalFormat === undefined) {
      delete process.env.LOGGER_FORMAT;
    } else {
      process.env.LOGGER_FORMAT = originalFormat;
    }
  });

  it('по умолчанию возвращает DevLogger (console)', () => {
    delete process.env.LOGGER_TYPE;
    delete process.env.LOGGER_FORMAT;
    expect(createLoggerByEnv()).toBeInstanceOf(DevLogger);
  });

  it('LOGGER_TYPE=json отдаёт JsonLogger', () => {
    process.env.LOGGER_TYPE = 'json';
    expect(createLoggerByEnv()).toBeInstanceOf(JsonLogger);
  });

  it('LOGGER_FORMAT=tskv отдаёт TskvLogger', () => {
    delete process.env.LOGGER_TYPE;
    process.env.LOGGER_FORMAT = 'TSKV';
    expect(createLoggerByEnv()).toBeInstanceOf(TskvLogger);
  });
});
