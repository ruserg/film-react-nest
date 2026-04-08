import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'debug').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('log пишет одну строку JSON с level, message и optionalParams', () => {
    const spy = jest.spyOn(console, 'log');
    logger.log('hello', { a: 1 }, 'extra');

    expect(spy).toHaveBeenCalledTimes(1);
    const line = String(spy.mock.calls[0][0]);
    const parsed = JSON.parse(line) as {
      level: string;
      message: string;
      optionalParams: unknown[];
    };

    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('hello');
    expect(parsed.optionalParams).toEqual([{ a: 1 }, 'extra']);
  });

  it('error использует console.error и сохраняет уровень error', () => {
    const spy = jest.spyOn(console, 'error');
    logger.error('failed');

    expect(spy).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(String(spy.mock.calls[0][0]));
    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('failed');
  });
});
