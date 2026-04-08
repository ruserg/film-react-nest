import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('log формирует строку TSKV с табами и переводом строки', () => {
    const spy = jest.spyOn(process.stdout, 'write');
    logger.log('ping', 42);

    expect(spy).toHaveBeenCalledTimes(1);
    const line = String(spy.mock.calls[0][0]);
    expect(line.endsWith('\n')).toBe(true);

    const trimmed = line.trimEnd();
    const fields = trimmed.split('\t');
    expect(fields.some((f) => f.startsWith('level='))).toBe(true);
    expect(fields.some((f) => f === 'message=ping')).toBe(true);
    expect(fields.some((f) => f === 'param0=42')).toBe(true);
  });

  it('warn пишет в stderr', () => {
    const spy = jest.spyOn(process.stderr, 'write');
    logger.warn('careful');

    expect(spy).toHaveBeenCalled();
    const line = String(spy.mock.calls[0][0]);
    expect(line).toContain('level=warn');
    expect(line).toContain('message=careful');
  });
});
