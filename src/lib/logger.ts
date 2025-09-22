import { format } from "node:util";

type LogMethod = (message: unknown, ...optionalParams: unknown[]) => void;

function write(stream: NodeJS.WriteStream, message: string): void {
  // Ensure a newline for each log entry
  stream.write(message.endsWith("\n") ? message : `${message}\n`);
}

const createLoggerMethod = (stream: NodeJS.WriteStream): LogMethod => {
  return (message: unknown, ...optionalParams: unknown[]): void => {
    try {
      const rendered =
        typeof message === "string"
          ? format(message, ...optionalParams)
          : format("%o", message, ...optionalParams);
      write(stream, rendered);
    } catch {
      // Swallow logging errors to avoid impacting application flow
    }
  };
};

export const logger = {
  info: createLoggerMethod(process.stdout),
  warn: createLoggerMethod(process.stdout),
  error: createLoggerMethod(process.stderr),
  debug: createLoggerMethod(process.stdout),
} as const;
