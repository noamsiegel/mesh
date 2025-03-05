// API related constants
export const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
export const API_VERSION = 'v1';
export const DEFAULT_HTTP_TIMEOUT = 10000; // 10 seconds in milliseconds

// Default configuration values
export const DEFAULT_LATITUDE = 52.52;
export const DEFAULT_LONGITUDE = 13.41;

// Unit system constants
export const UNIT_METRIC = 'metric';
export const UNIT_IMPERIAL = 'imperial';

// Unit defaults for metric system
export const METRIC_TEMPERATURE_UNIT = 'celsius';
export const METRIC_WIND_SPEED_UNIT = 'kmh';
export const METRIC_PRECIPITATION_UNIT = 'mm';

// Unit defaults for imperial system
export const IMPERIAL_TEMPERATURE_UNIT = 'fahrenheit';
export const IMPERIAL_WIND_SPEED_UNIT = 'mph';
export const IMPERIAL_PRECIPITATION_UNIT = 'inch';

// Default unit values
export const DEFAULT_UNIT = UNIT_METRIC;
export const DEFAULT_TEMPERATURE_UNIT = METRIC_TEMPERATURE_UNIT;
export const DEFAULT_WIND_SPEED_UNIT = METRIC_WIND_SPEED_UNIT;
export const DEFAULT_PRECIPITATION_UNIT = METRIC_PRECIPITATION_UNIT;
export const DEFAULT_TIMEZONE = 'GMT';
export const DEFAULT_TIMEFORMAT = 'iso8601';

// Date format constants
export const DATE_FORMAT = 'yyyy-MM-dd'; // ISO format for dates
export const MAX_FORECAST_DAYS = 16;

// Default daily parameters
export const DEFAULT_DAILY_PARAMS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'apparent_temperature_max',
  'apparent_temperature_min',
  'sunrise',
  'sunset',
  'daylight_duration',
  'sunshine_duration',
  'uv_index_max',
  'uv_index_clear_sky_max',
  'precipitation_sum',
  'rain_sum',
  'showers_sum',
  'snowfall_sum',
  'precipitation_hours',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'wind_gusts_10m_max',
  'winddirection_10m_dominant',
  'shortwave_radiation_sum',
  'et0_fao_evapotranspiration',
] as const;

// Coordinate validation constants
export const MIN_LATITUDE = -90.0;
export const MAX_LATITUDE = 90.0;
export const MIN_LONGITUDE = -180.0;
export const MAX_LONGITUDE = 180.0;

// Note: The timezone finder functionality from the Go code (tzf package)
// would need to be implemented separately using a JavaScript timezone library
// such as moment-timezone or a similar package.
// For now, we'll use a simple interface that can be implemented later
export interface TimezoneFinder {
  getTimezoneName(lon: number, lat: number): string;
}

// Placeholder for the timezone finder implementation
export let DefaultFinder: TimezoneFinder | null = null;

// Function to set the default timezone finder
export function setDefaultFinder(finder: TimezoneFinder) {
  DefaultFinder = finder;
}
