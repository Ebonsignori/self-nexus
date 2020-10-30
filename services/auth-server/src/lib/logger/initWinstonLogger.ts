import winston, { Logger } from 'winston';
import moment from 'moment-timezone';
import colors, { Color } from 'colors';
import { Format, TransformableInfo } from 'logform';
import StackTracey from 'stacktracey';
import { LogLevelStrings } from '../../types/common';
import { StringKeysStringOrNumberVals } from '../../types/generic';

export const LEVELS: { [key in LogLevelStrings]: number } = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  rest: 4,
  apollo: 5,
  typeorm: 6,
  redis: 7,
  test: 8,
};
const COLORS_FOR_LEVEL: { [key in LogLevelStrings]: keyof Color } = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  debug: 'cyan',
  rest: 'bgBlue',
  apollo: 'bgGreen',
  typeorm: 'bgCyan',
  redis: 'bgYellow',
  test: 'black',
};

function getLogFormat(useColors = true): Format {
  return winston.format.printf((info: TransformableInfo): string => {
    const timestamp = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');

    const level: LogLevelStrings = info.level;

    let output = `[type]='${level}' [date]='${timestamp}' [file]='${info.filename}' [message]='${info.message}'`;

    if (info.customInput) {
      const customInput: string = formatCustomInput(info.customInput);
      if (customInput) {
        output += ` ${customInput}`;
      }
    }

    if (useColors) {
      const color: keyof Color = COLORS_FOR_LEVEL[level];
      return colors[color](output);
    }
    return output;
  });
}

// Format custom input here for specific keys like "error" or "event"
function formatCustomInput(input: StringKeysStringOrNumberVals): string {
  if (typeof input !== 'object') {
    return '[custom_input_error]=not an object';
  }

  const keyValueFormat = (key, value): string => `[${key}]='${value}'`;

  // Some customInput has customFormatting, format each input and join them together into one string
  return Object.keys(input).map((key) => {
    let value: any = input[key];
    // Format error for  { customInput { error } }
    if (key === 'error' && value instanceof Error) {
      return keyValueFormat(key, `${value.message} \n${new StackTracey(value).pretty}\n`);
    }
    // Attempt to Stringify value
    if (typeof value === 'object') {
      try {
        value = JSON.stringify(value);
      } catch (e) {
        value = input[key];
      }
    }
    return keyValueFormat(key, value);
  }).join(' ');
}

const { LOG_LEVEL_FILTER, LOG_LEVEL_COLORED } = process.env;
const colorLogsByLevel = LOG_LEVEL_COLORED === 'true';
let winstonLogger: Logger;
export function getInitLogger(): Logger {
  if (winstonLogger) {
    return winstonLogger;
  }
  // eslint-disable-next-line no-console
  console.log(`Logging to console above log level: ${LOG_LEVEL_FILTER}`);

  winstonLogger = winston.createLogger({
    levels: LEVELS,
    transports: [
      new winston.transports.Console({
        level: LOG_LEVEL_FILTER || 'redis',
        format: getLogFormat(colorLogsByLevel),
      }),
    ],
    exceptionHandlers: [
      new winston.transports.Console({
        format: getLogFormat(colorLogsByLevel),
      }),
    ],
    exitOnError: false,
  });

  return winstonLogger;
}
