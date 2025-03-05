import { MAX_FORECAST_DAYS } from './constants';

// Base error types
export const ErrorTypes = {
  INVALID_DATE_FORMAT: 'invalid date format',
  INVALID_DATE_RANGE: `date must be between today and ${MAX_FORECAST_DAYS} days from today in the local timezone`,
  INVALID_CHECK_IN_DATE: 'check-in date cannot be before today in the local timezone',
  INVALID_CHECK_OUT_DATE: 'check-out date cannot be before check-in date',
  INVALID_COORDINATES: 'invalid coordinates provided',
  API_RESPONSE: 'API response error',
} as const;

// Weather error class
export class WeatherError extends Error {
  readonly code: string;
  readonly details: Record<string, unknown>;
  readonly originalError?: Error;

  constructor(code: string, message: string, details?: Record<string, unknown>, originalError?: Error) {
    super(message);
    this.name = 'WeatherError';
    this.code = code;
    this.details = details || {};
    this.originalError = originalError;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, WeatherError.prototype);
  }

  toString(): string {
    if (this.originalError) {
      return `[${this.code}] ${this.message}: ${this.originalError.message}`;
    }
    return `[${this.code}] ${this.message}`;
  }

  toJSON(): Record<string, unknown> {
    return {
      code: this.code,
      message: this.message,
      details: {
        ...this.details,
        code: this.code,
      },
    };
  }
}

// Helper function to get local time info
function getLocalTimeInfo(timezone: string): string {
  if (!timezone) return '';
  
  try {
    const now = new Date();
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    return ` (current time in ${timezone}: ${dateFormatter.format(now)})`;
  } catch {
    return '';
  }
}

// Error factory functions
export function createInvalidCheckInDateError(checkInDate: string, today: string, timezone: string): WeatherError {
  const localTimeInfo = getLocalTimeInfo(timezone);
  
  return new WeatherError(
    'INVALID_CHECK_IN_DATE',
    `check-in date (${checkInDate}) cannot be before today (${today})${localTimeInfo}`,
    {
      checkInDate,
      today,
      timezone,
    },
    new Error(ErrorTypes.INVALID_CHECK_IN_DATE)
  );
}

export function createInvalidDateRangeError(date: string, timezone: string): WeatherError {
  const localTimeInfo = getLocalTimeInfo(timezone);
  
  return new WeatherError(
    'INVALID_DATE_RANGE',
    `date ${date} is outside the valid range${localTimeInfo}`,
    {
      date,
      maxForecastDays: MAX_FORECAST_DAYS,
      timezone,
    },
    new Error(ErrorTypes.INVALID_DATE_RANGE)
  );
}

export function createInvalidCoordinatesError(lat: number, lon: number, timezone: string): WeatherError {
  const localTimeInfo = getLocalTimeInfo(timezone);
  
  return new WeatherError(
    'INVALID_COORDINATES',
    `invalid coordinates: lat=${lat}, lon=${lon}${localTimeInfo}`,
    {
      latitude: lat,
      longitude: lon,
      timezone,
    },
    new Error(ErrorTypes.INVALID_COORDINATES)
  );
}

export function createAPIError(statusCode: number, message: string): WeatherError {
  return new WeatherError(
    'API_ERROR',
    `API request failed with status ${statusCode}: ${message}`,
    {
      statusCode,
    },
    new Error(ErrorTypes.API_RESPONSE)
  );
}

// Helper function to check error types
export function isErrorType(error: unknown, targetType: string): boolean {
  if (error instanceof WeatherError) {
    return error.originalError?.message === targetType;
  }
  return false;
}
