import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

// Cores personalizadas para diferentes partes do log
const customColors = {
  error: 'bold red',
  warn: 'bold yellow',
  info: 'bold green',
  http: 'bold magenta',
  debug: 'bold cyan',
  verbose: 'bold blue',
};

// Adicionar esquema de cores personalizado
winston.addColors(customColors);

export const loggerConfig: WinstonModuleOptions = {
  transports: [
    // Console transport com formatação colorida aprimorada
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.colorize({ all: true }), // Colorizar toda a linha
        winston.format.printf(({ timestamp, level, message, context, trace }) => {
          // Formatação aprimorada com contexto destacado
          const timestampStr = `\x1b[36m${timestamp}\x1b[0m`; // Ciano para timestamp
          const contextStr = context ? `\x1b[33m[${context}]\x1b[0m` : ''; // Amarelo para contexto
          
          // Formatação da mensagem principal
          return `${timestampStr} ${level}: ${contextStr} ${message}${
            trace ? `\n\x1b[31m${trace}\x1b[0m` : '' // Vermelho para trace de erro
          }`;
        }),
      ),
    }),
    
    // File transports permanecem os mesmos (JSON para análise)
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};