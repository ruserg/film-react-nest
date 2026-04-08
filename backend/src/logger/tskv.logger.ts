import { Injectable, LoggerService } from '@nestjs/common';

/**
 * TSKV: плоские поля, значения — строки, поля разделены табуляцией, записи — перевод строки.
 */
@Injectable()
export class TskvLogger implements LoggerService {
  private stringify(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  private formatLine(
    level: string,
    message: unknown,
    optionalParams: unknown[],
  ): string {
    const parts = [
      `level=${this.stringify(level)}`,
      `message=${this.stringify(message)}`,
    ];
    optionalParams.forEach((p, i) => {
      parts.push(`param${i}=${this.stringify(p)}`);
    });
    return `${parts.join('\t')}\n`;
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    process.stdout.write(this.formatLine('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    process.stderr.write(this.formatLine('error', message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    process.stderr.write(this.formatLine('warn', message, optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    process.stdout.write(this.formatLine('debug', message, optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    process.stdout.write(this.formatLine('verbose', message, optionalParams));
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    process.stderr.write(this.formatLine('fatal', message, optionalParams));
  }
}
