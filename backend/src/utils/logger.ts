export class Logger {
  private static format(level: 'INFO' | 'WARN' | 'ERROR', message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  static info(message: string, ...args: any[]) {
    console.log(this.format('INFO', message), ...args);
  }

  static warn(message: string, ...args: any[]) {
    console.warn(this.format('WARN', message), ...args);
  }

  static error(message: string, ...args: any[]) {
    console.error(this.format('ERROR', message), ...args);
  }
}
